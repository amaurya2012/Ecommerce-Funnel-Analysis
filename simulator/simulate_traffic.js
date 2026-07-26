const axios = require('axios');

const API_URL = process.env.TELEMETRY_API_URL || 'http://localhost:4000/api/telemetry/log';
const TOTAL_SESSIONS = 200;
const CONCURRENCY = 8;

const STEP_TO_PROGRESS_ACTION = {
  browse: 'view',
  product_detail: 'view',
  cart: 'add_to_cart',
  checkout: 'purchase',
};

const STEP_ORDER = ['entry', 'browse', 'product_detail', 'cart', 'checkout'];
const DEVICE_POOL = [
  { type: 'desktop', weight: 0.5 },
  { type: 'mobile', weight: 0.4 },
  { type: 'tablet', weight: 0.1 },
];

function pickDeviceType() {
  const roll = Math.random();
  let cumulative = 0;
  for (const device of DEVICE_POOL) {
    cumulative += device.weight;
    if (roll <= cumulative) {
      return device.type;
    }
  }
  return DEVICE_POOL[DEVICE_POOL.length - 1].type;
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Determines how far a synthetic session progresses through the funnel.
 * A single random draw is used for the whole session so the resulting
 * population matches nested conversion rates: 100% reach browse, 70%
 * reach product_detail, 40% reach cart, 15% reach checkout.
 */
function rollFunnelDepth() {
  const r = Math.random();
  if (r < 0.15) return 4; // checkout / purchase
  if (r < 0.4) return 3; // cart
  if (r < 0.7) return 2; // product_detail
  return 1; // browse only
}

function addJitterMs(baseMs, minMs, maxMs) {
  return baseMs + minMs + Math.random() * (maxMs - minMs);
}

/**
 * Builds the full sequence of telemetry events for one synthetic session,
 * including a trailing 'abandon' event for sessions that don't convert.
 */
function buildSessionEvents() {
  const userId = makeId('user');
  const sessionId = makeId('session');
  const deviceType = pickDeviceType();
  const depth = rollFunnelDepth();

  const sessionStart = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7);
  let cursor = sessionStart;

  const events = [];

  for (let step = 1; step <= depth; step += 1) {
    const currentStep = STEP_ORDER[step - 1];
    const targetStep = STEP_ORDER[step];
    cursor = addJitterMs(cursor, 3000, 45000);

    events.push({
      userId,
      sessionId,
      currentStep,
      targetStep,
      action: STEP_TO_PROGRESS_ACTION[targetStep],
      deviceType,
      timestamp: new Date(cursor).toISOString(),
    });
  }

  const reachedStep = STEP_ORDER[depth];

  if (depth < 4) {
    cursor = addJitterMs(cursor, 5000, 120000);
    events.push({
      userId,
      sessionId,
      currentStep: reachedStep,
      targetStep: reachedStep,
      action: 'abandon',
      deviceType,
      timestamp: new Date(cursor).toISOString(),
    });
  }

  return { events, depth, converted: depth === 4 };
}

async function sendEvent(event) {
  await axios.post(API_URL, event, { timeout: 5000 });
}

async function runSession(sessionIndex, tally) {
  const { events, depth, converted } = buildSessionEvents();

  for (const event of events) {
    try {
      await sendEvent(event);
    } catch (err) {
      const reason = err.response ? `HTTP ${err.response.status}` : err.message;
      tally.failures += 1;
      console.error(`[session ${sessionIndex}] Failed to send event (${event.action}): ${reason}`);
    }
  }

  tally.depthCounts[depth] += 1;
  if (converted) {
    tally.conversions += 1;
  }
  tally.completedSessions += 1;
}

/**
 * Runs sessions with bounded concurrency so the backend receives a
 * realistic but manageable burst of traffic rather than 200 simultaneous
 * connections.
 */
async function runWithConcurrency(totalSessions, concurrency, tally) {
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < totalSessions) {
      const sessionIndex = nextIndex;
      nextIndex += 1;
      await runSession(sessionIndex, tally);
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
}

async function main() {
  console.log(`Simulating ${TOTAL_SESSIONS} user sessions against ${API_URL}`);
  console.log('Expected funnel shape: 100% browse, 70% product view, 40% cart, 15% checkout\n');

  const tally = {
    completedSessions: 0,
    conversions: 0,
    failures: 0,
    depthCounts: { 1: 0, 2: 0, 3: 0, 4: 0 },
  };

  const startedAt = Date.now();
  await runWithConcurrency(TOTAL_SESSIONS, CONCURRENCY, tally);
  const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log('\nSimulation complete.');
  console.log(`Duration: ${durationSeconds}s`);
  console.log(`Sessions completed: ${tally.completedSessions}`);
  console.log(`Reached browse only:         ${tally.depthCounts[1]}`);
  console.log(`Reached product detail:      ${tally.depthCounts[2]}`);
  console.log(`Reached cart:                ${tally.depthCounts[3]}`);
  console.log(`Reached checkout (purchase): ${tally.depthCounts[4]}`);
  console.log(`Converted sessions:          ${tally.conversions} (${((tally.conversions / TOTAL_SESSIONS) * 100).toFixed(1)}%)`);
  console.log(`Failed event writes:         ${tally.failures}`);
}

main().catch((err) => {
  console.error('Simulation crashed:', err.message);
  process.exit(1);
});

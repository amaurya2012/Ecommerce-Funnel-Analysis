const express = require('express');
const cors = require('cors');
const { ensureCsvExists, appendTelemetryRow, CSV_PATH } = require('./csvLogger');

const app = express();
const PORT = process.env.PORT || 4000;

const VALID_ACTIONS = ['view', 'click', 'add_to_cart', 'purchase', 'abandon'];
const VALID_DEVICE_TYPES = ['desktop', 'mobile', 'tablet'];
const REQUIRED_FIELDS = ['userId', 'sessionId', 'currentStep', 'targetStep', 'action', 'deviceType', 'timestamp'];

app.use(cors());
app.use(express.json({ limit: '256kb' }));

/**
 * Validates the shape and basic value constraints of an incoming telemetry
 * payload. Returns an array of human-readable error strings; an empty
 * array means the payload is valid.
 */
function validateTelemetryPayload(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Request body must be a JSON object.'];
  }

  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (typeof body.userId !== 'string') errors.push('userId must be a string.');
  if (typeof body.sessionId !== 'string') errors.push('sessionId must be a string.');
  if (typeof body.currentStep !== 'string' && typeof body.currentStep !== 'number') {
    errors.push('currentStep must be a string or number.');
  }
  if (typeof body.targetStep !== 'string' && typeof body.targetStep !== 'number') {
    errors.push('targetStep must be a string or number.');
  }
  if (!VALID_ACTIONS.includes(body.action)) {
    errors.push(`action must be one of: ${VALID_ACTIONS.join(', ')}`);
  }
  if (!VALID_DEVICE_TYPES.includes(body.deviceType)) {
    errors.push(`deviceType must be one of: ${VALID_DEVICE_TYPES.join(', ')}`);
  }
  if (Number.isNaN(Date.parse(body.timestamp))) {
    errors.push('timestamp must be a valid ISO 8601 date string.');
  }

  return errors;
}

app.post('/api/telemetry/log', async (req, res) => {
  const errors = validateTelemetryPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { userId, sessionId, currentStep, targetStep, action, deviceType, timestamp } = req.body;

  try {
    await appendTelemetryRow({ userId, sessionId, currentStep, targetStep, action, deviceType, timestamp });
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[POST /api/telemetry/log] Failed to persist event:', err.message);
    return res.status(500).json({ success: false, errors: ['Failed to write telemetry event to disk.'] });
  }
});

app.get('/api/telemetry/health', (req, res) => {
  res.status(200).json({ status: 'ok', csvPath: CSV_PATH });
});

app.use((req, res) => {
  res.status(404).json({ success: false, errors: [`No route for ${req.method} ${req.path}`] });
});

app.use((err, req, res, next) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ success: false, errors: ['Internal server error.'] });
});

ensureCsvExists();

app.listen(PORT, () => {
  console.log(`Telemetry server listening on http://localhost:${PORT}`);
  console.log(`Logging events to: ${CSV_PATH}`);
});

const request = require('supertest');

jest.mock('../csvLogger', () => ({
  ensureCsvExists: jest.fn(),
  appendTelemetryRow: jest.fn().mockResolvedValue(undefined),
  CSV_PATH: '/mock/user_behavior_logs.csv',
}));

const { appendTelemetryRow } = require('../csvLogger');
const app = require('../server');

function validPayload(overrides = {}) {
  return {
    userId: 'user_123',
    sessionId: 'session_456',
    currentStep: 'browse',
    targetStep: 'product_detail',
    action: 'view',
    deviceType: 'desktop',
    timestamp: '2026-07-16T10:00:00.000Z',
    ...overrides,
  };
}

describe('POST /api/telemetry/log', () => {
  beforeEach(() => {
    appendTelemetryRow.mockClear();
  });

  test('returns 201 and persists a valid event', async () => {
    const res = await request(app).post('/api/telemetry/log').send(validPayload());

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
    expect(appendTelemetryRow).toHaveBeenCalledTimes(1);
    expect(appendTelemetryRow).toHaveBeenCalledWith(validPayload());
  });

  test('returns 400 with errors for a missing field', async () => {
    const payload = validPayload();
    delete payload.sessionId;

    const res = await request(app).post('/api/telemetry/log').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toContain('Missing required field: sessionId');
    expect(appendTelemetryRow).not.toHaveBeenCalled();
  });

  test('returns 400 for an invalid action', async () => {
    const res = await request(app).post('/api/telemetry/log').send(validPayload({ action: 'teleport' }));

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(appendTelemetryRow).not.toHaveBeenCalled();
  });

  test('returns 500 if the CSV write fails', async () => {
    appendTelemetryRow.mockRejectedValueOnce(new Error('disk full'));

    const res = await request(app).post('/api/telemetry/log').send(validPayload());

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/telemetry/health', () => {
  test('returns 200 with the CSV path', async () => {
    const res = await request(app).get('/api/telemetry/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.csvPath).toBe('/mock/user_behavior_logs.csv');
  });
});

describe('unknown routes', () => {
  test('returns 404 for an undefined route', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
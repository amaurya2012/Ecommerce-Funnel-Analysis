const { validateTelemetryPayload, VALID_ACTIONS, VALID_DEVICE_TYPES } = require('../validation');

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

describe('validateTelemetryPayload', () => {
  test('accepts a fully valid payload', () => {
    expect(validateTelemetryPayload(validPayload())).toEqual([]);
  });

  test('rejects a non-object body', () => {
    expect(validateTelemetryPayload(null)).toEqual(['Request body must be a JSON object.']);
    expect(validateTelemetryPayload(undefined)).toEqual(['Request body must be a JSON object.']);
    expect(validateTelemetryPayload('a string')).toEqual(['Request body must be a JSON object.']);
  });

  test('reports every missing required field', () => {
    const errors = validateTelemetryPayload({});
    expect(errors).toEqual(
      expect.arrayContaining([
        'Missing required field: userId',
        'Missing required field: sessionId',
        'Missing required field: currentStep',
        'Missing required field: targetStep',
        'Missing required field: action',
        'Missing required field: deviceType',
        'Missing required field: timestamp',
      ])
    );
  });

  test('treats empty string fields as missing', () => {
    const errors = validateTelemetryPayload(validPayload({ userId: '' }));
    expect(errors).toContain('Missing required field: userId');
  });

  test.each(VALID_ACTIONS)('accepts action "%s"', (action) => {
    expect(validateTelemetryPayload(validPayload({ action }))).toEqual([]);
  });

  test('rejects an invalid action', () => {
    const errors = validateTelemetryPayload(validPayload({ action: 'teleport' }));
    expect(errors.some((e) => e.startsWith('action must be one of'))).toBe(true);
  });

  test.each(VALID_DEVICE_TYPES)('accepts deviceType "%s"', (deviceType) => {
    expect(validateTelemetryPayload(validPayload({ deviceType }))).toEqual([]);
  });

  test('rejects an invalid deviceType', () => {
    const errors = validateTelemetryPayload(validPayload({ deviceType: 'smart-fridge' }));
    expect(errors.some((e) => e.startsWith('deviceType must be one of'))).toBe(true);
  });

  test('rejects a malformed timestamp', () => {
    const errors = validateTelemetryPayload(validPayload({ timestamp: 'not-a-date' }));
    expect(errors).toContain('timestamp must be a valid ISO 8601 date string.');
  });

  test('accepts numeric currentStep/targetStep values', () => {
    expect(validateTelemetryPayload(validPayload({ currentStep: 1, targetStep: 2 }))).toEqual([]);
  });

  test('rejects a non-string userId', () => {
    const errors = validateTelemetryPayload(validPayload({ userId: 12345 }));
    expect(errors).toContain('userId must be a string.');
  });
});
const VALID_ACTIONS = ['view', 'click', 'add_to_cart', 'purchase', 'abandon'];
const VALID_DEVICE_TYPES = ['desktop', 'mobile', 'tablet'];
const REQUIRED_FIELDS = ['userId', 'sessionId', 'currentStep', 'targetStep', 'action', 'deviceType', 'timestamp'];

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

module.exports = {
  VALID_ACTIONS,
  VALID_DEVICE_TYPES,
  REQUIRED_FIELDS,
  validateTelemetryPayload,
};
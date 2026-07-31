const { getSupabaseClient } = require('../_lib/supabaseClient');
const { validateTelemetryPayload } = require('../../../backend/validation');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, errors: ['Method not allowed.'] });
  }

  const errors = validateTelemetryPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { userId, sessionId, currentStep, targetStep, action, deviceType, variant, timestamp } = req.body;

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('telemetry_events').insert({
      user_id: userId,
      session_id: sessionId,
      current_step: currentStep,
      target_step: targetStep,
      action,
      device_type: deviceType,
      variant: variant || null,
      event_timestamp: timestamp,
    });

    if (error) throw error;

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[api/telemetry/log] Failed to persist event:', err.message);
    return res.status(500).json({ success: false, errors: ['Failed to write telemetry event.'] });
  }
};
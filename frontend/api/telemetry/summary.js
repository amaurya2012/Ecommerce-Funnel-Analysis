const { getSupabaseClient } = require('../_lib/supabaseClient');
const { buildSummaryFromEvents } = require('../../../backend/analyticsEngine');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('telemetry_events').select('*');

    if (error) throw error;

    const events = (data || []).map((row) => ({
      userId: row.user_id,
      sessionId: row.session_id,
      currentStep: row.current_step,
      targetStep: row.target_step,
      action: row.action,
      deviceType: row.device_type,
      variant: row.variant,
      timestamp: row.event_timestamp,
    }));

    const summary = buildSummaryFromEvents(events);
    return res.status(200).json(summary);
  } catch (err) {
    console.error('[api/telemetry/summary] Failed to build summary:', err.message);
    return res.status(500).json({ success: false, errors: ['Failed to compute summary.'] });
  }
};
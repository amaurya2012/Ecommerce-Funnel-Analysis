const { getSupabaseClient } = require('../_lib/supabaseClient');

const CSV_HEADERS = ['userId', 'sessionId', 'currentStep', 'targetStep', 'action', 'deviceType', 'variant', 'timestamp'];

function escapeCsvField(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  const needsQuoting = /[",\n\r]/.test(stringValue);
  if (!needsQuoting) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('telemetry_events').select('*').order('event_timestamp', { ascending: true });

    if (error) throw error;

    const lines = [CSV_HEADERS.join(',')];

    (data || []).forEach((row) => {
      const mapped = {
        userId: row.user_id,
        sessionId: row.session_id,
        currentStep: row.current_step,
        targetStep: row.target_step,
        action: row.action,
        deviceType: row.device_type,
        variant: row.variant,
        timestamp: row.event_timestamp,
      };
      lines.push(CSV_HEADERS.map((field) => escapeCsvField(mapped[field])).join(','));
    });

    const csv = lines.join('\n') + '\n';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="user_behavior_logs_export.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('[api/telemetry/export] Failed to export:', err.message);
    return res.status(500).json({ success: false, errors: ['Failed to export telemetry data.'] });
  }
};
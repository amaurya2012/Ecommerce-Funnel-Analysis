const { getSupabaseClient } = require('../_lib/supabaseClient');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('telemetry_events').select('id').limit(1);
    if (error) throw error;

    return res.status(200).json({ status: 'ok', storage: 'supabase' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
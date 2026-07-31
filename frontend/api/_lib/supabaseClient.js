const { createClient } = require('@supabase/supabase-js');

let cachedClient = null;

/**
 * Lazily creates and caches a Supabase client using the service_role /
 * secret key. This key bypasses Row Level Security and must never be sent
 * to the browser — it only ever lives in Vercel's server-side environment
 * variables and is read here, inside a serverless function.
 */
function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.');
  }

  cachedClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cachedClient;
}

module.exports = { getSupabaseClient };
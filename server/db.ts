import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

function getEnv(name: string, fallback?: string) {
  return process.env[name] || fallback || '';
}

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY',
  getEnv('SUPABASE_SERVICE_KEY', getEnv('SUPABASE_KEY', getEnv('SUPABASE_SECRET')))
);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[ECC] Missing Supabase server credentials.');
}

export function getServerClient() {
  const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-ecc-api': 'rpc-v3' } },
  });
  return supa;
}
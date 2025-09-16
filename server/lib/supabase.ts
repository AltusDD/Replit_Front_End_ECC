// server/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ?? '';

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SERVICE_KEY ??
  process.env.SUPABASE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ?? '';

export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[ECC/API] Missing Supabase envs; url:', !!SUPABASE_URL, ' key:', !!SUPABASE_KEY);
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
}
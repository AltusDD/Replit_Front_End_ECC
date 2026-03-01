/**
 * Central environment variable tracking and validation for the server.
 */

export const requiredServerEnv = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL'
];

/**
 * Checks for missing required server environment variables.
 * Fallbacks are checked implicitly (e.g. SUPABASE_SERVICE_ROLE instead of SUPABASE_SERVICE_ROLE_KEY).
 */
export function getMissingServerEnv(): string[] {
  const missing: string[] = [];
  
  if (!process.env.SUPABASE_URL) {
    missing.push('SUPABASE_URL');
  }
  
  const hasServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!hasServiceRole) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }
  
  const hasDbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!hasDbUrl) {
    missing.push('DATABASE_URL');
  }

  return missing;
}

/**
 * Returns a dictionary of environment variable presence (names only, no values).
 */
export function serverEnvPresence(): Record<string, 'present' | 'missing'> {
  return {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'present' : 'missing',
    SUPABASE_SERVICE_ROLE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE) ? 'present' : 'missing',
    DATABASE_URL: (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL) ? 'present' : 'missing',
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
    VITE_API_BASE: process.env.VITE_API_BASE ? 'present' : 'missing'
  };
}

/**
 * Throws a formatted error if required environment variables are missing.
 * Safe to call inside handlers, do NOT call at the top layer of imports.
 */
export function requireServerEnv() {
  const missing = getMissingServerEnv();
  if (missing.length > 0) {
    throw new Error(`Missing server env: ${missing.join(', ')}`);
  }
}

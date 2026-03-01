import { Pool } from 'pg';
import { requireServerEnv } from './env';

let _pool: Pool | null = null;

export function getDbPool(): Pool {
  requireServerEnv();

  if (!_pool) {
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

    _pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  return _pool;
}

// Proxy the old pool export for backwards compatibility
export const pool = new Proxy({} as Pool, {
  get: (target, prop) => getDbPool()[prop as keyof Pool]
});

export default pool;
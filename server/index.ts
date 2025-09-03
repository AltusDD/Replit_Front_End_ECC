import express from "express";
import cors from "cors";
import { Pool } from "pg";

const PORT = Number(process.env.PORT_API || 8787);

const app = express();
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL_DISABLE ? false : { rejectUnauthorized: false }
});

const TABLE_MAP: Record<string, string> = {
  properties: process.env.TBL_PROPERTIES || "properties",
  units: process.env.TBL_UNITS || "units",
  leases: process.env.TBL_LEASES || "leases",
  tenants: process.env.TBL_TENANTS || "tenants",
  owners: process.env.TBL_OWNERS || "owners",
};

// Validate table name (letters, numbers, _, . only)
function isValidTableName(name: string): boolean {
  return /^[a-zA-Z0-9_.]+$/.test(name);
}

app.get("/api/health", async (_req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ 
      ok: true, 
      mode: "postgres", 
      now: new Date().toISOString(),
      tables: TABLE_MAP,
      env_vars_used: ["DATABASE_URL", "PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE"]
    });
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      mode: "postgres", 
      error: error.message 
    });
  }
});

app.get("/api/portfolio/:entity", async (req, res) => {
  try {
    const entity = req.params.entity;
    const table = TABLE_MAP[entity];
    
    if (!table) {
      return res.status(400).json({ error: `Unknown collection: ${entity}` });
    }
    
    if (!isValidTableName(table)) {
      return res.status(400).json({ error: `Invalid table name: ${table}` });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM ${table} LIMIT 1000`);
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error(`Error fetching ${req.params.entity}:`, error);
    res.status(500).json({ 
      error: error.message,
      table: TABLE_MAP[req.params.entity],
      entity: req.params.entity
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Dev API] PostgreSQL mode - http://localhost:${PORT}`);
  console.log(`[Dev API] Tables mapped:`, TABLE_MAP);
});

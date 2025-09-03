import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

const PORT = Number(process.env.PORT_API || 8787);

// Parse Supabase URL - handle both REST API format and PostgreSQL connection string
let SUPABASE_URL = process.env.SUPABASE_URL || "";

if (SUPABASE_URL.startsWith("postgresql://")) {
  // Extract project reference from PostgreSQL URL and convert to REST API URL
  const match = SUPABASE_URL.match(/db\.(.+?)\.supabase\.co/);
  if (match) {
    SUPABASE_URL = `https://${match[1]}.supabase.co`;
  }
}

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

const app = express();
app.use(cors());

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

// Set up PostgreSQL pool for direct SQL queries
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (SUPABASE_URL.startsWith("postgresql://")) {
  // Use the PostgreSQL connection string directly
  pool = new Pool({ connectionString: SUPABASE_URL });
} else if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  // Construct PostgreSQL connection string from Supabase URL
  const match = SUPABASE_URL.match(/https:\/\/(.+?)\.supabase\.co/);
  if (match) {
    const projectId = match[1];
    const pgUrl = `postgresql://postgres.${projectId}:${SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
    pool = new Pool({ connectionString: pgUrl });
  }
}

const TABLE_MAP: Record<string, string> = {
  properties: process.env.TBL_PROPERTIES || "properties",
  units: process.env.TBL_UNITS || "units",
  leases: process.env.TBL_LEASES || "leases",
  tenants: process.env.TBL_TENANTS || "tenants",
  owners: process.env.TBL_OWNERS || "owners",
};

app.get("/api/test-pg", async (_req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: "No PostgreSQL pool available" });
    
    // Test basic connection
    const result = await pool.query('SELECT 1 as test');
    
    // Get table info
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    // Get column info for properties table
    const propertyCols = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'properties'
      ORDER BY ordinal_position
    `);
    
    res.json({
      connection: 'success',
      test_query: result.rows,
      available_tables: tables.rows.map(r => r.table_name),
      property_columns: propertyCols.rows.map(r => r.column_name)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        ok: false, 
        mode: "supabase", 
        error: "Supabase not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        env_vars_needed: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY"]
      });
    }
    
    // Simple test - just try to select from properties table (or any table)
    const { data, error } = await supabase.from(TABLE_MAP.properties).select("*").limit(1);
    
    res.json({ 
      ok: true, 
      mode: "supabase", 
      now: new Date().toISOString(),
      tables: TABLE_MAP,
      env_vars_used: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_ANON_KEY"],
      connection_test: error ? `Warning: ${error.message}` : "Success",
      database_url_available: !!process.env.DATABASE_URL,
      pg_pool_available: !!pool
    });
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      mode: "supabase", 
      error: error.message 
    });
  }
});

app.get("/api/portfolio/:entity", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
    
    const { entity } = req.params;
    const propertiesTable = TABLE_MAP.properties;
    const unitsTable = TABLE_MAP.units;
    const leasesTable = TABLE_MAP.leases;
    const tenantsTable = TABLE_MAP.tenants;
    const ownersTable = TABLE_MAP.owners;

    let query: string;
    
    switch (entity) {
      case 'properties':
        // PROPERTIES: Simple test query with aliases
        query = `
          SELECT
            p.id, p.doorloop_id, p.name, p.type, p.class, p.active,
            p.address_city AS city,
            p.address_state AS state,
            COALESCE(p.unit_count, 0) AS unit_count,
            p.occupancy_rate AS occupancy
          FROM ${propertiesTable} p
          ORDER BY p.name NULLS LAST;
        `;
        break;

      case 'units':
        // UNITS: include property name + normalized fields
        query = `
          SELECT
            u.id, u.doorloop_id,
            p.name AS property,
            COALESCE(u.unit_number, '') AS unit_number,
            u.beds,
            u.baths,
            u.sq_ft,
            COALESCE(
              u.status,
              CASE WHEN EXISTS (
                SELECT 1 FROM ${leasesTable} l WHERE l.unit_id = u.id AND lower(l.status) = 'active'
              ) THEN 'Occupied' ELSE 'Vacant' END
            ) AS status,
            u.rent_amount AS market_rent
          FROM ${unitsTable} u
          LEFT JOIN ${propertiesTable} p ON p.id = u.property_id
          ORDER BY p.name NULLS LAST, unit_number NULLS LAST;
        `;
        break;

      case 'leases':
        // LEASES: include property name, tenant names, rent, start, end, status
        query = `
          WITH tn AS (
            SELECT l.id AS lease_id,
                   COALESCE(
                     (SELECT t2.display_name FROM ${tenantsTable} t2 WHERE t2.id = l.primary_tenant_id),
                     (SELECT t3.display_name FROM ${tenantsTable} t3 WHERE t3.id = l.tenant_id)
                   ) AS tenant_names
            FROM ${leasesTable} l
          )
          SELECT
            l.id, l.doorloop_id,
            tn.tenant_names,
            p.name AS property,
            ROUND(l.rent_cents / 100.0, 2) AS rent,
            l.start_date AS start,
            l.end_date   AS "end",
            l.status
          FROM ${leasesTable} l
          LEFT JOIN ${propertiesTable} p ON p.id = l.property_id
          LEFT JOIN tn ON tn.lease_id = l.id
          ORDER BY l.start_date DESC NULLS LAST;
        `;
        break;

      case 'tenants':
        // TENANTS: include property + unit via current/most-recent lease
        query = `
          WITH latest_lease AS (
            SELECT DISTINCT ON (t.id)
                   t.id AS tenant_id, l.id AS lease_id, l.status,
                   l.unit_id, l.property_id,
                   l.start_date, l.end_date
            FROM ${tenantsTable} t
            LEFT JOIN ${leasesTable} l ON (l.primary_tenant_id = t.id OR l.tenant_id = t.id)
            ORDER BY t.id, COALESCE(l.updated_at, l.start_date) DESC NULLS LAST
          )
          SELECT
            t.id, t.doorloop_id,
            COALESCE(t.display_name, t.full_name, CONCAT_WS(' ', t.first_name, t.last_name)) AS name,
            p.name AS property,
            COALESCE(u.unit_number, '') AS unit,
            t.email,
            '' AS phone,
            COALESCE(ll.status, t.type) AS status,
            0 AS balance
          FROM ${tenantsTable} t
          LEFT JOIN latest_lease ll ON ll.tenant_id = t.id
          LEFT JOIN ${unitsTable} u ON u.id = ll.unit_id
          LEFT JOIN ${propertiesTable} p ON p.id = COALESCE(u.property_id, ll.property_id)
          ORDER BY name NULLS LAST;
        `;
        break;

      case 'owners':
        // OWNERS: include property_count (simplified since crosswalk table may not exist)
        query = `
          SELECT
            o.id, o.doorloop_id,
            COALESCE(o.display_name, o.company_name, o.full_name, CONCAT_WS(' ', o.first_name, o.last_name)) AS name,
            '' AS email,
            '' AS phone,
            0 AS property_count,
            o.active
          FROM ${ownersTable} o
          ORDER BY name NULLS LAST;
        `;
        break;

      default:
        return res.status(400).json({ error: `Unknown collection ${entity}` });
    }

    // Execute raw SQL query using PostgreSQL pool
    if (pool) {
      try {
        console.log(`Executing PostgreSQL query for ${entity}:`, query.substring(0, 200) + '...');
        const result = await pool.query(query);
        console.log(`PostgreSQL query successful for ${entity}, returned ${result.rows.length} rows`);
        return res.json(result.rows || []);
      } catch (error: any) {
        console.error(`PostgreSQL query failed for ${entity}:`, error.message);
        console.error(`Query was:`, query.substring(0, 500));
        // Fallback to Supabase simple select
        if (supabase) {
          const table = TABLE_MAP[entity];
          const fallback = await supabase.from(table).select("*").limit(1000);
          if (fallback.error) return res.status(500).json({ error: fallback.error.message, table });
          return res.json(Array.isArray(fallback.data) ? fallback.data : []);
        }
        return res.status(500).json({ error: error.message });
      }
    }
    
    // Fallback to Supabase if no pool available
    if (supabase) {
      const table = TABLE_MAP[entity];
      const { data, error } = await supabase.from(table).select("*").limit(1000);
      if (error) return res.status(500).json({ error: error.message, table });
      return res.json(Array.isArray(data) ? data : []);
    }

    return res.status(500).json({ error: "No database connection available" });
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`[Dev API] Supabase mode - http://localhost:${PORT}`);
  console.log(`[Dev API] Tables mapped:`, TABLE_MAP);
  console.log(`[Dev API] PostgreSQL pool:`, pool ? 'Connected' : 'Not available');
  if (!supabase) {
    console.log(`[Dev API] ⚠️  Supabase not configured - need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY`);
  }
});

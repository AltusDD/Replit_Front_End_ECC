import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.PORT_API || 8787);
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

const app = express();
app.use(cors());

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

const TABLE_MAP: Record<string, string> = {
  properties: process.env.TBL_PROPERTIES || "properties",
  units: process.env.TBL_UNITS || "units",
  leases: process.env.TBL_LEASES || "leases",
  tenants: process.env.TBL_TENANTS || "tenants",
  owners: process.env.TBL_OWNERS || "owners",
};

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
    
    // Test connection
    const { error } = await supabase.from(TABLE_MAP.properties).select("count", { count: "exact", head: true });
    if (error && error.code !== "PGRST116") { // PGRST116 = table doesn't exist, which is ok for health check
      throw error;
    }
    
    res.json({ 
      ok: true, 
      mode: "supabase", 
      now: new Date().toISOString(),
      tables: TABLE_MAP,
      env_vars_used: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_ANON_KEY"]
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
    const table = TABLE_MAP[req.params.entity];
    if (!table) return res.status(400).json({ error: `Unknown collection ${req.params.entity}` });

    const { data, error } = await supabase.from(table).select("*").limit(1000);
    if (error) return res.status(500).json({ error: error.message, table });
    res.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`[Dev API] Supabase mode - http://localhost:${PORT}`);
  console.log(`[Dev API] Tables mapped:`, TABLE_MAP);
  if (!supabase) {
    console.log(`[Dev API] ⚠️  Supabase not configured - need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY`);
  }
});

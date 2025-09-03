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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), tables: TABLE_MAP });
});

app.get("/api/portfolio/:entity", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    const table = TABLE_MAP[req.params.entity];
    if (!table) return res.status(400).json({ error: `Unknown collection ${req.params.entity}` });

    const { data, error } = await supabase.from(table).select("*").limit(1000);
    if (error) return res.status(500).json({ error: error.message, table });
    res.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.listen(PORT, () => console.log(`[Dev API] http://localhost:${PORT}`));

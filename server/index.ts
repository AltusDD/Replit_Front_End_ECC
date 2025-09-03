import express from "express";
import cors from "cors";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** ───────────────────────────────────────────────────────────────────
 *  ECC Dev API — resilient Supabase wiring
 *  - Accepts either REST URL (https://<ref>.supabase.co) or a Postgres
 *    connection string and auto-converts it to REST URL.
 *  - Clear /api/health and /api/portfolio/:collection endpoints.
 *  - No changes to the frontend nav or pages required.
 *  ─────────────────────────────────────────────────────────────────── */

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT_API || 8787);

// Map of logical collections -> table names (override via Replit secrets)
const TABLE: Record<string, string> = {
  properties: process.env.TBL_PROPERTIES || "properties",
  units: process.env.TBL_UNITS || "units",
  leases: process.env.TBL_LEASES || "leases",
  tenants: process.env.TBL_TENANTS || "tenants",
  owners: process.env.TBL_OWNERS || "owners",
};

function coerceRestUrl(raw?: string | null): string | null {
  if (!raw) return null;

  // Already a proper REST URL?
  const rest = raw.match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i);
  if (rest) return `https://${rest[1]}.supabase.co`;

  // Postgres connection string → pull out project ref after "@db."
  // Handles postgres:// and postgresql:// forms.
  const m = raw.match(/@db\.([a-z0-9-]+)\.supabase\.co/i);
  if (m) return `https://${m[1]}.supabase.co`;

  // Unknown format; let client creation fail with a clear message.
  return raw;
}

function makeSupabase(): {
  client: SupabaseClient | null;
  restUrl?: string;
  error?: string;
} {
  const rawUrl =
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_REST_URL ||
    null;

  const restUrl = coerceRestUrl(rawUrl);
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!restUrl || !key) {
    return {
      client: null,
      restUrl: restUrl || undefined,
      error:
        "Missing Supabase REST URL and/or key. Set SUPABASE_URL=https://<ref>.supabase.co and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).",
    };
  }

  try {
    const client = createClient(restUrl, key, { auth: { persistSession: false } });
    return { client, restUrl };
  } catch (e: any) {
    return { client: null, restUrl, error: `createClient failed: ${e?.message || e}` };
  }
}

const supa = makeSupabase();

function sendErr(res: express.Response, http: number, err: any) {
  const body = {
    ok: false,
    message: err?.message || String(err),
    details: err?.details,
    code: err?.code,
    hint: err?.hint,
  };
  if (http >= 500) console.error("[API ERROR]", body);
  return res.status(http).json(body);
}

/** Health check — shows if we’re connected and why not */
app.get("/api/health", async (_req, res) => {
  if (!supa.client) {
    return res.status(500).json({
      ok: false,
      supabase: "disconnected",
      reason: supa.error,
      restUrl: supa.restUrl,
      rawUrlSample: (process.env.SUPABASE_URL || "").slice(0, 80),
    });
  }
  try {
    const { error } = await supa.client
      .from(TABLE.properties)
      .select("id", { head: true, count: "exact" })
      .limit(1);
    if (error) throw error;
    res.json({ ok: true, supabase: "connected", restUrl: supa.restUrl });
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Generic portfolio collections */
app.get("/api/portfolio/:collection", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  const seg = String(req.params.collection || "").toLowerCase();
  const table = TABLE[seg];
  if (!table) return sendErr(res, 404, `Unknown collection: ${seg}`);

  try {
    // Keep it simple & robust — the frontend maps/format the fields.
    const { data, error } = await supa.client.from(table).select("*").limit(5000);
    if (error) throw error;
    res.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

app.use("/api", (_req, res) => res.status(404).json({ ok: false, message: "Not found" }));
app.get("/", (_req, res) => res.type("text/plain").send("ECC Dev API running"));

app.listen(PORT, () => {
  console.log(`[Dev API] Listening on :${PORT}`);
  if (!supa.client) {
    console.warn(`[Dev API] Supabase not ready: ${supa.error}`);
    console.warn(`[Dev API] Raw SUPABASE_URL sample: ${(process.env.SUPABASE_URL || "").slice(0, 80)}…`);
  } else {
    console.log(`[Dev API] Supabase REST URL: ${supa.restUrl}`);
  }
});

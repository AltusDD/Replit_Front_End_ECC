import express from "express";
import cors from "cors";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PropertyOut, UnitOut, LeaseOut, TenantOut, OwnerOut } from "./mappings";

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

/** Properties with computed units & occupancy */
app.get("/api/portfolio/properties", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    // Get properties - use actual column names from the current database
    const { data: propertiesData, error: propsError } = await supa.client
      .from(TABLE.properties)
      .select("*")
      .limit(5000);

    if (propsError) throw propsError;

    // Get units data for occupancy calculation
    const { data: unitsData, error: unitsError } = await supa.client
      .from(TABLE.units)
      .select(`
        id,
        property_id,
        status
      `);

    if (unitsError) throw unitsError;

    // Group units by property
    const unitsByProperty = new Map();
    const occupiedByProperty = new Map();

    (unitsData || []).forEach((unit: any) => {
      const propId = String(unit.property_id);
      if (!unitsByProperty.has(propId)) {
        unitsByProperty.set(propId, 0);
        occupiedByProperty.set(propId, 0);
      }
      unitsByProperty.set(propId, unitsByProperty.get(propId) + 1);
      
      if (unit.status && ['occupied', 'occ', 'active'].includes(unit.status.toLowerCase())) {
        occupiedByProperty.set(propId, occupiedByProperty.get(propId) + 1);
      }
    });

    const properties: PropertyOut[] = (propertiesData || []).map((row: any) => {
      const propId = String(row.id);
      const totalUnits = unitsByProperty.get(propId) || 0;
      const occupiedUnits = occupiedByProperty.get(propId) || 0;
      const occPct = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

      return {
        id: row.id,
        name: row.name || "—",
        type: row.type || "—",
        class: row.class || "—",
        state: row.address_state || "—",
        city: row.address_city || "—",
        zip: row.address_zip || "—",
        units: totalUnits,
        occPct: occPct,
        active: Boolean(row.active)
      };
    });

    res.json(properties);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Units with property context */
app.get("/api/portfolio/units", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { data, error } = await supa.client
      .from(TABLE.units)
      .select("*")
      .limit(5000);
    if (error) throw error;

    // Now get property names for the units
    const propertyIds = [...new Set((data || []).map((u: any) => u.property_id).filter(Boolean))];
    const { data: propertiesData } = await supa.client
      .from(TABLE.properties)
      .select("id, name")
      .in('id', propertyIds);

    const propertyMap = new Map((propertiesData || []).map((p: any) => [p.id, p.name || "—"]));

    const units: UnitOut[] = (data || []).map((row: any) => ({
      id: row.id,
      propertyName: propertyMap.get(row.property_id) || "—",
      unitLabel: row.unit_number || row.number || row.name || "—",
      beds: row.beds || row.bedrooms,
      baths: row.baths || row.bathrooms,
      sqft: row.sq_ft || row.square_feet || row.sqft,
      status: row.status,
      marketRent: row.rent_amount || row.market_rent || 0
    }));

    res.json(units);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Leases with property, unit, and tenant context */
app.get("/api/portfolio/leases", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    // Get leases
    const { data: leasesData, error } = await supa.client
      .from(TABLE.leases)
      .select("*")
      .limit(5000);
    if (error) throw error;

    // Get related properties, units, and tenants
    const propertyIds = [...new Set((leasesData || []).map((l: any) => l.property_id).filter(Boolean))];
    const unitIds = [...new Set((leasesData || []).map((l: any) => l.unit_id).filter(Boolean))];
    const tenantIds = [...new Set((leasesData || []).map((l: any) => l.primary_tenant_id || l.tenant_id).filter(Boolean))];

    const [propertiesRes, unitsRes, tenantsRes] = await Promise.all([
      supa.client!.from(TABLE.properties).select("id, name").in('id', propertyIds),
      supa.client!.from(TABLE.units).select("id, unit_number").in('id', unitIds),
      supa.client!.from(TABLE.tenants).select("id, display_name, full_name, first_name, last_name").in('id', tenantIds)
    ]);

    const propertyMap = new Map((propertiesRes.data || []).map((p: any) => [p.id, p.name || "—"]));
    const unitMap = new Map((unitsRes.data || []).map((u: any) => [u.id, u.unit_number || "—"]));
    const tenantMap = new Map((tenantsRes.data || []).map((t: any) => [
      t.id, 
      t.display_name || t.full_name || 
      (t.first_name && t.last_name ? `${t.first_name} ${t.last_name}` : "—")
    ]));

    const leases: LeaseOut[] = (leasesData || []).map((row: any) => ({
      id: row.id,
      propertyName: propertyMap.get(row.property_id) || "—",
      unitLabel: unitMap.get(row.unit_id) || "—",
      tenants: tenantMap.get(row.primary_tenant_id || row.tenant_id) ? [tenantMap.get(row.primary_tenant_id || row.tenant_id)] : [],
      status: row.status || "unknown",
      start: row.start_date,
      end: row.end_date,
      rent: row.rent_cents ? row.rent_cents / 100 : 0
    }));

    res.json(leases);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Tenants with latest lease context */
app.get("/api/portfolio/tenants", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { data: tenantsData, error } = await supa.client
      .from(TABLE.tenants)
      .select("*")
      .limit(5000);
    if (error) throw error;

    // Get latest lease info for each tenant
    const tenants: TenantOut[] = await Promise.all((tenantsData || []).map(async (tenant: any) => {
      const { data: leaseData } = await supa.client!
        .from(TABLE.leases)
        .select("property_id, unit_id")
        .or(`primary_tenant_id.eq.${tenant.id},tenant_id.eq.${tenant.id}`)
        .order('start_date', { ascending: false })
        .limit(1);

      let propertyName = null;
      let unitLabel = null;

      if (leaseData && leaseData.length > 0) {
        const lease = leaseData[0];
        // Get property and unit names
        const [propRes, unitRes] = await Promise.all([
          supa.client!.from(TABLE.properties).select("name").eq('id', lease.property_id).single(),
          supa.client!.from(TABLE.units).select("unit_number").eq('id', lease.unit_id).single()
        ]);
        propertyName = propRes.data?.name;
        unitLabel = unitRes.data?.unit_number;
      }
      
      return {
        id: tenant.id,
        name: tenant.display_name || tenant.full_name || 
              (tenant.first_name && tenant.last_name ? `${tenant.first_name} ${tenant.last_name}` : "—"),
        email: tenant.email,
        phone: null, // Not available in current schema
        propertyName,
        unitLabel,
        type: tenant.type || "PROSPECT_TENANT",
        balance: 0 // Not available in current schema
      };
    }));

    res.json(tenants);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Owners */
app.get("/api/portfolio/owners", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { data, error } = await supa.client
      .from(TABLE.owners)
      .select("*")
      .limit(5000);
    if (error) throw error;

    const owners: OwnerOut[] = (data || []).map((row: any) => ({
      id: row.id,
      company: row.company_name || row.display_name || row.full_name || "—",
      email: null, // Not available in current schema
      phone: null, // Not available in current schema  
      active: Boolean(row.active)
    }));

    res.json(owners);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Debug endpoint for SQL queries */
app.get("/api/portfolio/_debug/sql", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");
  
  const query = String(req.query.q || "");
  const limit = Math.min(parseInt(String(req.query.limit || "10")), 50);
  
  if (!query.toLowerCase().startsWith("select")) {
    return res.status(400).json({ error: "SELECT queries only" });
  }
  
  try {
    const { data, error } = await supa.client.rpc('exec_sql', { 
      query_text: `${query} LIMIT ${limit}` 
    });
    if (error) throw error;
    res.json(data || []);
  } catch (e: any) {
    // Fallback to table queries if RPC doesn't work
    try {
      if (query.includes("FROM properties")) {
        const { data, error } = await supa.client.from(TABLE.properties).select("*").limit(limit);
        if (error) throw error;
        res.json(data || []);
      } else {
        return sendErr(res, 400, "RPC not available, use table-specific queries");
      }
    } catch (fallbackError: any) {
      return sendErr(res, 500, fallbackError);
    }
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

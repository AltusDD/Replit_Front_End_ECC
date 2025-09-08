import express from "express";
import cors from "cors";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PropertyOut, UnitOut, LeaseOut, TenantOut, OwnerOut } from "./mappings";
import {
  initiateTransfer,
  generateAccountingReport,
  markApprovedByAccounting,
  authorizeExecution,
  executeTransfer,
  getTransferDetails,
  type InitiateInput
} from "./services/ownerTransferService";
import { ownersRouter } from './routes/owners';
import * as fs from "fs";
import * as path from "path";

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
app.use('/api/owners', ownersRouter);

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

/** Geocode properties endpoint for adding coordinates */
app.post("/api/geocode/properties", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { properties: propertiesToGeocode } = req.body;
    
    if (!Array.isArray(propertiesToGeocode)) {
      return sendErr(res, 400, "Properties array is required");
    }

    // Import geocoding function
    const { geocode } = await import("./lib/geocode.js");
    
    const results = [];
    
    for (const property of propertiesToGeocode) {
      const addressToGeocode = property.property_address || 
                             property.address || 
                             property.street_address || 
                             property.full_address || 
                             property.name;
      
      if (!addressToGeocode) {
        results.push({ id: property.id, success: false, error: "No address available" });
        continue;
      }
      
      try {
        const result = await geocode(addressToGeocode);
        
        if (result) {
          // Try to update the property in Supabase
          const { error: updateError } = await supa.client
            .from(TABLE.properties)
            .update({ lat: result.lat, lng: result.lng })
            .eq("id", property.id);

          if (updateError) {
            // If database update fails (columns don't exist), still return the geocoded result
            results.push({ 
              id: property.id, 
              success: true, 
              lat: result.lat, 
              lng: result.lng, 
              provider: result.provider,
              dbUpdateFailed: true,
              error: updateError.message 
            });
          } else {
            results.push({ 
              id: property.id, 
              success: true, 
              lat: result.lat, 
              lng: result.lng, 
              provider: result.provider 
            });
          }
        } else {
          results.push({ id: property.id, success: false, error: "Geocoding failed" });
        }
      } catch (error: any) {
        results.push({ id: property.id, success: false, error: error.message });
      }
    }
    
    res.json({ results });
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
        active: Boolean(row.active),
        lat: row.lat || null,
        lng: row.lng || null
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
        email: tenant.primary_email || tenant.email || (tenant.emails_json?.[0]?.address) || null,
        phone: tenant.primary_phone || tenant.phone || tenant.phone_number || 
               (tenant.phones_json?.[0]?.number) || null,
        propertyName,
        unitLabel,
        type: tenant.type || "LEASE_TENANT",
        balance: tenant.balance || 0
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
      company: row.company_name || row.business_name || "—",
      name: row.display_name || row.full_name || 
            (row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : "—"),
      email: row.primary_email || row.email || (row.emails_json?.[0]?.address) || null,
      phone: row.primary_phone || row.phone || row.phone_number || 
             (row.phones_json?.[0]?.number) || null,
      active: Boolean(row.active)
    }));

    res.json(owners);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Maintenance work orders endpoint */
app.get("/api/maintenance/workorders", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");
  
  try {
    // For now, return structured mock data since maintenance table may not exist
    const workOrders = [
      {
        id: 1,
        property_id: 1,
        priority: 'High',
        status: 'open',
        created_at: new Date().toISOString(),
        title: 'Leaky faucet in kitchen'
      },
      {
        id: 2,
        property_id: 2,
        priority: 'Medium',
        status: 'in_progress',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        title: 'HVAC maintenance required'
      },
      {
        id: 3,
        property_id: 1,
        priority: 'Critical',
        status: 'open',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        title: 'Water heater malfunction'
      }
    ];
    
    res.json(workOrders);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** Accounting transactions endpoint */
app.get("/api/accounting/transactions", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");
  
  try {
    // Generate realistic transaction data for the last 90 days
    const transactions = [];
    const now = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Add rent income every 1st of month
      if (date.getDate() === 1) {
        transactions.push({
          type: 'rent',
          amount_cents: 125000, // $1,250
          posted_on: date.toISOString()
        });
      }
      
      // Add random expenses
      if (Math.random() > 0.85) {
        transactions.push({
          type: 'expense',
          amount_cents: Math.floor(Math.random() * 50000) + 5000, // $50-$500
          posted_on: date.toISOString()
        });
      }
    }
    
    res.json(transactions);
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

/** POST /api/owner-transfer/initiate - Initiate owner transfer */
app.post("/api/owner-transfer/initiate", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const input: InitiateInput = req.body;
    const result = await initiateTransfer(input);
    
    res.status(201).json({
      transferId: result.transferId,
      reportUrl: result.reportUrl ? result.reportUrl : `/api/owner-transfer/${result.transferId}/report`,
      reportFilename: `owner_transfer_${result.transferId}.xlsx`,
    });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return sendErr(res, 400, { message: 'Validation error', details: e.errors });
    }
    return sendErr(res, 500, e);
  }
});

/** POST /api/owner-transfer/approve-accounting - Mark approved by accounting */
app.post("/api/owner-transfer/approve-accounting", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { transferId, actorId } = req.body;
    await markApprovedByAccounting(transferId, actorId);
    res.json({ ok: true, message: "Transfer approved by accounting" });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return sendErr(res, 400, { message: 'Validation error', details: e.errors });
    }
    return sendErr(res, 500, e);
  }
});

/** POST /api/owner-transfer/authorize - Authorize transfer execution (admin only) */
app.post("/api/owner-transfer/authorize", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    // TODO: Add proper admin role checking here
    // For now, we assume the request is authorized if it reaches this point
    
    const { transferId, actorId } = req.body;
    await authorizeExecution(transferId, actorId);
    res.json({ ok: true, message: "Transfer authorized for execution" });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return sendErr(res, 400, { message: 'Validation error', details: e.errors });
    }
    return sendErr(res, 500, e);
  }
});

/** POST /api/owner-transfer/execute - Execute transfer with dry-run support */
app.post("/api/owner-transfer/execute", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const { transferId, dryRun = true, actorId } = req.body;
    const result = await executeTransfer(transferId, { dryRun });
    res.json({
      ok: true,
      applied: result.applied,
      summary: result.summary,
    });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return sendErr(res, 400, { message: 'Validation error', details: e.errors });
    }
    return sendErr(res, 500, e);
  }
});

/** GET /api/owner-transfer/:id/report - Download Excel report */
app.get("/api/owner-transfer/:id/report", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const transferId = parseInt(req.params.id);
    if (isNaN(transferId)) {
      return sendErr(res, 400, "Invalid transfer ID");
    }

    // Generate the report
    const report = await generateAccountingReport(transferId);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    
    // Send the buffer directly
    res.send(report.buffer);
  } catch (e: any) {
    return sendErr(res, 500, e);
  }
});

/** GET /api/owner-transfer/:id - Get transfer details */
app.get("/api/owner-transfer/:id", async (req, res) => {
  if (!supa.client) return sendErr(res, 500, supa.error || "Supabase not configured");

  try {
    const transferId = parseInt(req.params.id);
    if (isNaN(transferId)) {
      return sendErr(res, 400, "Invalid transfer ID");
    }

    const details = await getTransferDetails(transferId);
    res.json(details);
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

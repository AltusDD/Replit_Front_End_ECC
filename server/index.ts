// server/index.ts
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.PORT_API || 8787);

// -- ENV (supports either Supabase REST URL or postgres://) -------------------
const RAW_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_URL = RAW_URL.startsWith("postgres://")
  ? `https://${RAW_URL.split("@")[1]?.split(":")[0] || "project.supabase.co"}`
  : RAW_URL;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn("[Dev API] Missing SUPABASE_URL or key; endpoints will 500.");
}

const supabase = (SUPABASE_URL && SERVICE_KEY)
  ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
  : null;

const app = express();
app.use(cors());

function bad(res: any, msg: string, code = 500) {
  return res.status(code).json({ ok: false, error: msg });
}

app.get("/api/health", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    // ping a light table
    const { data, error } = await supabase.from("properties").select("id").limit(1);
    if (error) throw error;
    res.json({ ok: true, database_url_available: !!SUPABASE_URL, pg_pool_available: true, tables_seen: data?.length ?? 0 });
  } catch (e: any) {
    return bad(res, String(e));
  }
});

// Helpers
const ACTIVE_LEASE_STATUSES = ["active", "renewal"];

function currency(n?: number | null) {
  if (n == null) return null;
  return Math.round(Number(n) * 100) / 100;
}

// --- PROPERTIES --------------------------------------------------------------
app.get("/api/portfolio/properties", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    // base properties
    const { data: props, error } = await supabase
      .from("properties")
      .select("id, doorloop_id, name, type, class, active, address_city, address_state, unit_count, occupied_unit_count, vacant_unit_count, occupancy_rate")
      .order("name", { ascending: true });
    if (error) throw error;

    // Fallback counts from units/leases when null
    const nullCounts = props.some(p => p.unit_count == null || p.occupancy_rate == null);
    let unitsByProperty: Record<number, { total: number; occupied: number; }> = {};
    if (nullCounts) {
      const [{ data: units }, { data: leases }] = await Promise.all([
        supabase.from("units").select("id, property_id"),
        supabase.from("leases").select("unit_id, status").in("status", ACTIVE_LEASE_STATUSES),
      ]);
      const activeUnitIds = new Set<number>();
      (leases || []).forEach(l => { if (l.unit_id) activeUnitIds.add(l.unit_id); });
      (units || []).forEach(u => {
        if (!u.property_id) return;
        const entry = (unitsByProperty[u.property_id] ||= { total: 0, occupied: 0 });
        entry.total += 1;
        if (activeUnitIds.has(u.id)) entry.occupied += 1;
      });
    }

    const rows = props.map(p => {
      const fallback = unitsByProperty[p.id] || { total: p.unit_count ?? 0, occupied: p.occupied_unit_count ?? 0 };
      const total = p.unit_count ?? fallback.total ?? 0;
      const occ = p.occupancy_rate ?? (total ? Math.round(( (p.occupied_unit_count ?? fallback.occupied) / total) * 1000) / 10 : 0);
      return {
        id: p.id,
        doorloop_id: p.doorloop_id,
        name: p.name,
        type: p.type,
        class: p.class,
        active: p.active,
        city: p.address_city,
        state: p.address_state,
        unit_count: total,
        occupancy: occ, // percent number (e.g., 54.2)
      };
    });

    res.json(rows);
  } catch (e: any) {
    bad(res, String(e));
  }
});

// --- UNITS -------------------------------------------------------------------
app.get("/api/portfolio/units", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    const [{ data: units, error: e1 }, { data: props, error: e2 }, { data: leases, error: e3 }] = await Promise.all([
      supabase.from("units").select("id, doorloop_id, unit_number, beds, baths, sq_ft, rent_amount, status, property_id"),
      supabase.from("properties").select("id, name, address_city, address_state"),
      supabase.from("leases").select("unit_id, status").in("status", ACTIVE_LEASE_STATUSES),
    ]);
    if (e1 || e2 || e3) throw (e1 || e2 || e3);

    const propById = new Map(props?.map(p => [p.id, p]) || []);
    const activeUnits = new Set((leases || []).filter(l => l.unit_id).map(l => l.unit_id as number));

    const rows = (units || []).map(u => {
      const p = propById.get(u.property_id || -1);
      const status = u.status || (activeUnits.has(u.id) ? "Occupied" : "Vacant");
      return {
        id: u.id,
        doorloop_id: u.doorloop_id,
        property: p?.name || "—",
        unit_number: u.unit_number || "—",
        beds: u.beds ?? null,
        baths: u.baths ?? null,
        sqft: u.sq_ft ?? null,
        status,
        market_rent: currency(u.rent_amount),
        address: p ? `${p.name} ${p.address_city || ""} ${p.address_state || ""}`.trim() : "",
      };
    });

    res.json(rows);
  } catch (e: any) {
    bad(res, String(e));
  }
});

// --- LEASES ------------------------------------------------------------------
app.get("/api/portfolio/leases", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    const [{ data: leases, error: e1 }, { data: props, error: e2 }, { data: tenants, error: e3 }] = await Promise.all([
      supabase.from("leases").select("id, doorloop_id, property_id, unit_id, primary_tenant_id, tenant_id, start_date, end_date, rent_cents, status"),
      supabase.from("properties").select("id, name"),
      supabase.from("tenants").select("id, display_name, full_name, first_name, last_name"),
    ]);
    if (e1 || e2 || e3) throw (e1 || e2 || e3);

    const propById = new Map(props?.map(p => [p.id, p.name]) || []);
    const tById = new Map(
      (tenants || []).map(t => [t.id, t.display_name || t.full_name || [t.first_name, t.last_name].filter(Boolean).join(" ") || "—"])
    );

    const rows = (leases || []).map(l => ({
      id: l.id,
      doorloop_id: l.doorloop_id,
      tenants: tById.get(l.primary_tenant_id) || tById.get(l.tenant_id) || "—",
      property: propById.get(l.property_id || -1) || "—",
      rent: currency((l.rent_cents ?? 0) / 100),
      start: l.start_date,
      end: l.end_date,
      status: l.status,
    }));

    res.json(rows);
  } catch (e: any) {
    bad(res, String(e));
  }
});

// --- TENANTS -----------------------------------------------------------------
app.get("/api/portfolio/tenants", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    const [{ data: tenants, error: e1 }, { data: leases, error: e2 }, { data: units, error: e3 }, { data: props, error: e4 }] = await Promise.all([
      supabase.from("tenants").select("id, doorloop_id, display_name, full_name, first_name, last_name, primary_email, primary_phone, email"),
      supabase.from("leases").select("id, status, start_date, end_date, unit_id, property_id, primary_tenant_id, tenant_id"),
      supabase.from("units").select("id, unit_number, property_id"),
      supabase.from("properties").select("id, name"),
    ]);
    if (e1 || e2 || e3 || e4) throw (e1 || e2 || e3 || e4);

    const unitById = new Map(units?.map(u => [u.id, u]) || []);
    const propById = new Map(props?.map(p => [p.id, p.name]) || []);

    // latest lease by tenant
    const leasesByTenant = new Map<number, any>();
    (leases || []).forEach(l => {
      const ids = [l.primary_tenant_id, l.tenant_id].filter(Boolean) as number[];
      ids.forEach(tid => {
        const prev = leasesByTenant.get(tid);
        const ts = new Date(l.end_date || l.start_date || "1970-01-01").getTime();
        if (!prev || ts > prev._ts) leasesByTenant.set(tid, { ...l, _ts: ts });
      });
    });

    const rows = (tenants || []).map(t => {
      const name = t.display_name || t.full_name || [t.first_name, t.last_name].filter(Boolean).join(" ") || "—";
      const ll = leasesByTenant.get(t.id);
      const unit = ll ? unitById.get(ll.unit_id || -1) : null;
      return {
        id: t.id,
        doorloop_id: t.doorloop_id,
        name,
        property: propById.get(unit?.property_id || ll?.property_id || -1) || "—",
        unit: unit?.unit_number || "—",
        email: t.primary_email || t.email || "—",
        phone: t.primary_phone || "—",
        status: ll?.status || "—",
        balance: 0,
      };
    });

    res.json(rows);
  } catch (e: any) {
    bad(res, String(e));
  }
});

// --- OWNERS (with property counts via property_owners) -----------------------
app.get("/api/portfolio/owners", async (_req, res) => {
  try {
    if (!supabase) return bad(res, "Supabase not configured");
    const [{ data: owners, error: e1 }, { data: links, error: e2 }] = await Promise.all([
      supabase.from("owners").select("id, doorloop_id, display_name, company_name, full_name, first_name, last_name, primary_email, primary_phone, active"),
      supabase.from("property_owners").select("owner_id"),
    ]);
    if (e1 || e2) throw (e1 || e2);

    const counts = new Map<number, number>();
    (links || []).forEach(l => counts.set(l.owner_id, (counts.get(l.owner_id) || 0) + 1));

    const rows = (owners || []).map(o => ({
      id: o.id,
      doorloop_id: o.doorloop_id,
      name: o.display_name || o.company_name || o.full_name || [o.first_name, o.last_name].filter(Boolean).join(" ") || "—",
      email: o.primary_email || "—",
      phone: o.primary_phone || "—",
      property_count: counts.get(o.id) || 0,
      active: !!o.active,
    }));

    res.json(rows);
  } catch (e: any) {
    bad(res, String(e));
  }
});

app.listen(PORT, () => {
  console.log(`[Dev API] listening on :${PORT}`);
});

#!/usr/bin/env node

// Node 18+ has global fetch
const API = "http://localhost:8787";
const GET = (p) => fetch(`${API}${p}`).then(r => r.json());

const diagIds = async () => {
  try {
    const r = await GET("/api/rpc/diag/ids");
    if (r && (r.properties || r.units)) return r;
  } catch {}
  return GET("/api/diag/ids");
};

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const log = (k, v) => console.log(k.padEnd(28), v);

(async () => {
  console.log("=== ECC Cards: API Smoke ===");
  const h = await GET("/api/health").catch(()=>null);
  assert(h && h.ok, "API /health not ok");
  log("health", "OK");

  const env = await GET("/api/diag/env");
  log("env.SUPABASE_URL_KEY", env.SUPABASE_URL_KEY || "NA");

  const ids = await diagIds();
  assert(ids, "No diag IDs route");
  const pick = (arr) => Array.isArray(arr) && arr.length ? arr[0] : null;

  const P = pick(ids.properties);
  const U = pick(ids.units);
  const L = pick(ids.leases);
  const O = pick(ids.owners);
  const T = pick(ids.tenants);

  log("IDs", JSON.stringify({ P, U, L, O, T }));

  // Property
  if (P != null) {
    const r = await GET(`/api/rpc/get_property_card?id=${P}`);
    assert(r && r.property, "Property card missing property");
    assert(r.kpis && "units" in r.kpis && "occupancyPct" in r.kpis, "Property KPIs incomplete");
    log("property", "PASS");
  } else log("property", "SKIP (no properties)");

  // Unit
  if (U != null) {
    const r = await GET(`/api/rpc/get_unit_card?id=${U}`);
    assert(r && r.unit, "Unit card missing unit");
    log("unit", `PASS (lease:${r.lease?.id ?? "none"} tenant:${r.tenant?.id ?? "none"})`);
  } else log("unit", "SKIP (no units)");

  // Lease
  if (L != null) {
    const r = await GET(`/api/rpc/get_lease_card?id=${L}`);
    assert(r && r.lease, "Lease card missing lease");
    log("lease", `PASS (unit:${r.unit?.id ?? "none"} tenant:${r.tenant?.id ?? "none"})`);
  } else log("lease", "SKIP (no leases)");

  // Owner
  if (O != null) {
    const r = await GET(`/api/rpc/get_owner_card?id=${O}`);
    assert(r && r.owner, "Owner card missing owner");
    assert(Array.isArray(r.properties), "Owner card missing properties array");
    log("owner", `PASS (props:${r.properties.length})`);
  } else log("owner", "SKIP (no owners)");

  // Tenant
  if (T != null) {
    const r = await GET(`/api/rpc/get_tenant_card?id=${T}`);
    assert(r && r.tenant, "Tenant card missing tenant");
    log("tenant", `PASS (activeLease:${r.activeLease ? "yes" : "no"})`);
  } else log("tenant", "SKIP (no tenants)");

  console.log("=== DONE ===");
})().catch((e) => {
  console.error("SMOKE FAIL:", e?.message || e);
  process.exit(1);
});
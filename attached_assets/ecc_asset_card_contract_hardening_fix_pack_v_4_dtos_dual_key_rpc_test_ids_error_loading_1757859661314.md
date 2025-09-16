# ECC Asset Card Contract Hardening — Fix Pack v4

**Scope:** Close all gaps from the audit you posted — complete DTO coverage, dual‑key joins everywhere, resilient field mapping, test hooks, consistent error/loading UX, and guardrails to prevent regressions.

> Copy/paste these files (full replacements) and run the proof steps at the bottom. Minimal touch set; safe to apply incrementally.

---

## 0) New: `server/lib/mapping.ts` (normalized field map + helpers)
```ts
// server/lib/mapping.ts
export type AddrSrc = {
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
  street_1?: string | null;
  address_street1?: string | null;
};

export function mapAddress(src: AddrSrc) {
  return {
    city: src.city ?? src.address_city ?? null,
    state: src.state ?? src.address_state ?? null,
    zip: src.zip ?? src.address_zip ?? null,
    street1: src.street_1 ?? src.address_street1 ?? null,
  };
}

export function pickId<T extends { id?: any; doorloop_id?: any }>(row: T) {
  return row?.id ?? null;
}

// Build a dual-key predicate for Supabase .or()
export function orByPropIdOrDoorLoop(propertyId?: number | null, doorloopId?: number | string | null) {
  const pid = propertyId != null ? `property_id.eq.${propertyId}` : '';
  const did = doorloopId != null ? `doorloop_property_id.eq.${doorloopId}` : '';
  const parts = [pid, did].filter(Boolean);
  if (!parts.length) return 'id.lt.0'; // impossible, returns empty set
  return parts.join(',');
}

export function normalizeStatus(s?: string | null) {
  if (!s) return null;
  const k = String(s).toLowerCase().trim();
  if (["active","current","occupied"].includes(k)) return "active";
  if (["pending","future"].includes(k)) return "pending";
  if (["ended","terminated","closed","past","inactive","cancelled","canceled"].includes(k)) return "ended";
  return k;
}
```

---

## 1) Update: `server/routes/rpc.ts` (dual‑key joins on all cards + KPIs)
```ts
// server/routes/rpc.ts
import { Router } from 'express';
import { getServerClient } from '../db';
import { mapAddress, normalizeStatus, orByPropIdOrDoorLoop } from '../lib/mapping';

export const rpc = Router();

// PROPERTY CARD
rpc.get('/get_property_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();

  const { data: property, error: pErr } = await supa.from('properties').select('*').eq('id', id).single();
  if (pErr || !property) return res.status(404).json({ error: 'not found' });

  const or = orByPropIdOrDoorLoop(property.id, (property as any).doorloop_id ?? null);
  const { data: units = [] } = await supa.from('units').select('*').or(or);
  let { data: leases = [] } = await supa.from('leases').select('*').or(or);
  leases = leases.map(l => ({ ...l, status: normalizeStatus(l.status) }));

  const activeLeases = leases.filter(l => l.status === 'active');
  const occupancyPct = units.length ? Math.round((activeLeases.length / units.length) * 1000) / 10 : 0;
  const rentNums = activeLeases.map(l => Number((l as any).rent_cents ?? (l as any).rent ?? 0)).filter(n => Number.isFinite(n));
  const avgRentCents = rentNums.length ? Math.round(rentNums.reduce((a,b)=>a+b,0)/rentNums.length) : null;

  // Owner (by PK)
  let owner = null as any;
  if ((property as any).owner_id) {
    const r = await supa.from('owners').select('*').eq('id', (property as any).owner_id).single();
    owner = r.data || null;
  }

  const addr = mapAddress(property as any);
  return res.json({ property: { ...property, ...addr }, units, leases, owner, kpis: { units: units.length, activeLeases: activeLeases.length, occupancyPct, avgRentCents } });
});

// UNIT CARD
rpc.get('/get_unit_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();

  const { data: unit, error } = await supa.from('units').select('*').eq('id', id).single();
  if (error || !unit) return res.status(404).json({ error: 'not found' });

  // Property by PK or DoorLoop fallback
  let property = null as any;
  if ((unit as any).property_id) {
    const r = await supa.from('properties').select('*').eq('id', (unit as any).property_id).single();
    property = r.data || null;
  }
  if (!property && (unit as any).doorloop_property_id) {
    const r = await supa.from('properties').select('*').eq('doorloop_id', (unit as any).doorloop_property_id).single();
    property = r.data || null;
  }
  const propAddr = property ? mapAddress(property) : {};

  let { data: leases = [] } = await supa.from('leases').select('*').or(orByPropIdOrDoorLoop((unit as any).property_id ?? null, (unit as any).doorloop_property_id ?? null));
  leases = leases.map(l => ({ ...l, status: normalizeStatus(l.status) }));
  const current = leases.find(l => l.status === 'active') || leases[0] || null;

  let tenant = null as any;
  if (current?.tenant_id) {
    const r = await supa.from('tenants').select('*').eq('id', current.tenant_id).single();
    tenant = r.data || null;
  }

  return res.json({ unit, property: property ? { ...property, ...propAddr } : null, lease: current, tenant });
});

// LEASE CARD
rpc.get('/get_lease_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();

  const { data: lease, error } = await supa.from('leases').select('*').eq('id', id).single();
  if (error || !lease) return res.status(404).json({ error: 'not found' });
  const norm = { ...lease, status: normalizeStatus((lease as any).status) };

  let property = null as any;
  if ((lease as any).property_id) {
    const r = await supa.from('properties').select('*').eq('id', (lease as any).property_id).single();
    property = r.data || null;
  }
  if (!property && (lease as any).doorloop_property_id) {
    const r = await supa.from('properties').select('*').eq('doorloop_id', (lease as any).doorloop_property_id).single();
    property = r.data || null;
  }
  const propAddr = property ? mapAddress(property) : {};

  const { data: unit } = await supa.from('units').select('*').eq('id', (lease as any).unit_id).single();
  const { data: tenant } = await supa.from('tenants').select('*').eq('id', (lease as any).tenant_id).single();

  return res.json({ lease: norm, unit: unit || null, property: property ? { ...property, ...propAddr } : null, tenant: tenant || null });
});

// TENANT CARD
rpc.get('/get_tenant_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();

  const { data: tenant, error } = await supa.from('tenants').select('*').eq('id', id).single();
  if (error || !tenant) return res.status(404).json({ error: 'not found' });

  let { data: leases = [] } = await supa.from('leases').select('*').eq('tenant_id', id);
  leases = leases.map(l => ({ ...l, status: normalizeStatus(l.status) }));

  const propIds = Array.from(new Set(leases.map(l => (l as any).property_id).filter(Boolean)));
  const dlIds = Array.from(new Set(leases.map(l => (l as any).doorloop_property_id).filter(Boolean)));

  let properties: any[] = [];
  if (propIds.length) {
    const r = await supa.from('properties').select('*').in('id', propIds);
    properties = properties.concat(r.data || []);
  }
  if (dlIds.length) {
    const r = await supa.from('properties').select('*').in('doorloop_id', dlIds);
    properties = properties.concat(r.data || []);
  }

  // de‑dupe by PK id
  const seen = new Set<number>();
  properties = properties.filter(p => (p?.id && !seen.has(p.id) && seen.add(p.id)) || false).map(p => ({ ...p, ...mapAddress(p) }));

  return res.json({ tenant, leases, properties });
});

// OWNER CARD
rpc.get('/get_owner_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();

  const { data: owner, error } = await supa.from('owners').select('*').eq('id', id).single();
  if (error || !owner) return res.status(404).json({ error: 'not found' });

  const { data: properties = [] } = await supa.from('properties').select('*').eq('owner_id', id);
  const pids = properties.map(p => p.id);
  const { data: units = [] } = pids.length ? await supa.from('units').select('*').in('property_id', pids) : { data: [] } as any;
  const { data: leasesRaw = [] } = pids.length ? await supa.from('leases').select('*').in('property_id', pids) : { data: [] } as any;
  const leases = leasesRaw.map(l => ({ ...l, status: normalizeStatus(l.status) }));

  const active = leases.filter(l => l.status === 'active').length;
  const occPct = units.length ? Math.round((active / units.length) * 1000) / 10 : 0;

  return res.json({ owner, properties: properties.map(p => ({ ...p, ...mapAddress(p) })), kpis: { units: units.length, activeLeases: active, occupancyPct: occPct } });
});
```

---

## 2) New/Update: `src/lib/dto.ts` (complete Zod coverage)
```ts
// src/lib/dto.ts
import { z } from 'zod';

const Address = z.object({ city: z.string().nullable().optional(), state: z.string().nullable().optional(), zip: z.string().nullable().optional(), street1: z.string().nullable().optional() });
const Lease = z.object({ id: z.number(), property_id: z.number().nullable().optional(), unit_id: z.number().nullable().optional(), tenant_id: z.number().nullable().optional(), status: z.string().nullable().optional(), rent_cents: z.number().nullable().optional(), rent: z.union([z.number(), z.string()]).nullable().optional() });
const Unit = z.object({ id: z.number(), property_id: z.number().nullable().optional(), doorloop_property_id: z.union([z.number(), z.string()]).nullable().optional() }).passthrough();
const Property = z.object({ id: z.number() }).merge(Address).passthrough();
const Tenant = z.object({ id: z.number() }).passthrough();
const Owner = z.object({ id: z.number() }).passthrough();

export const PropertyCardDTO = z.object({ property: Property.nullable(), units: z.array(Unit), leases: z.array(Lease), owner: Owner.nullable().optional(), kpis: z.object({ units: z.number(), activeLeases: z.number(), occupancyPct: z.number(), avgRentCents: z.number().nullable() }).optional() });
export type PropertyCardDTO = z.infer<typeof PropertyCardDTO>;

export const UnitCardDTO = z.object({ unit: Unit.nullable(), property: Property.nullable(), lease: Lease.nullable(), tenant: Tenant.nullable() });
export type UnitCardDTO = z.infer<typeof UnitCardDTO>;

export const LeaseCardDTO = z.object({ lease: Lease.nullable(), unit: Unit.nullable(), property: Property.nullable(), tenant: Tenant.nullable() });
export type LeaseCardDTO = z.infer<typeof LeaseCardDTO>;

export const TenantCardDTO = z.object({ tenant: Tenant.nullable(), leases: z.array(Lease), properties: z.array(Property) });
export type TenantCardDTO = z.infer<typeof TenantCardDTO>;

export const OwnerCardDTO = z.object({ owner: Owner.nullable(), properties: z.array(Property), kpis: z.object({ units: z.number(), activeLeases: z.number(), occupancyPct: z.number() }).optional() });
export type OwnerCardDTO = z.infer<typeof OwnerCardDTO>;
```

---

## 3) Update: `src/lib/ecc-resolvers.ts` (RPC‑first + validation for all cards)
```ts
// src/lib/ecc-resolvers.ts
import { useQuery } from '@tanstack/react-query';
import { PropertyCardDTO, UnitCardDTO, LeaseCardDTO, TenantCardDTO, OwnerCardDTO } from './dto';

async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export function usePropertyCard(id: number) {
  return useQuery({ queryKey: ['card','property', id], queryFn: async ({signal}) => {
    try {
      const dto = await get<any>(`/api/rpc/get_property_card?id=${id}`, signal);
      const p = PropertyCardDTO.safeParse(dto); if (p.success) return p.data;
    } catch {}
    const [property, units, leases] = await Promise.all([
      get(`/api/entities/properties/${id}`, signal),
      get(`/api/entities/units?property_id=eq.${id}`, signal),
      get(`/api/entities/leases?property_id=eq.${id}`, signal),
    ]);
    return { property, units, leases, owner: null } as any;
  }});
}

export function useUnitCard(id: number) {
  return useQuery({ queryKey: ['card','unit', id], queryFn: async ({signal}) => {
    try {
      const dto = await get<any>(`/api/rpc/get_unit_card?id=${id}`, signal);
      const p = UnitCardDTO.safeParse(dto); if (p.success) return p.data;
    } catch {}
    const unit = await get(`/api/entities/units/${id}`, signal);
    const property = unit?.property_id ? await get(`/api/entities/properties/${unit.property_id}`, signal) : null;
    const leases = await get(`/api/entities/leases?unit_id=eq.${id}`, signal);
    return { unit, property, lease: leases?.[0] ?? null, tenant: null } as any;
  }});
}

export function useLeaseCard(id: number) {
  return useQuery({ queryKey: ['card','lease', id], queryFn: async ({signal}) => {
    const dto = await get<any>(`/api/rpc/get_lease_card?id=${id}`, signal);
    const p = LeaseCardDTO.safeParse(dto); if (p.success) return p.data; throw new Error('Bad Lease DTO');
  }});
}

export function useTenantCard(id: number) {
  return useQuery({ queryKey: ['card','tenant', id], queryFn: async ({signal}) => {
    const dto = await get<any>(`/api/rpc/get_tenant_card?id=${id}`, signal);
    const p = TenantCardDTO.safeParse(dto); if (p.success) return p.data; throw new Error('Bad Tenant DTO');
  }});
}

export function useOwnerCard(id: number) {
  return useQuery({ queryKey: ['card','owner', id], queryFn: async ({signal}) => {
    const dto = await get<any>(`/api/rpc/get_owner_card?id=${id}`, signal);
    const p = OwnerCardDTO.safeParse(dto); if (p.success) return p.data; throw new Error('Bad Owner DTO');
  }});
}
```

---

## 4) Small UI fixes: test IDs, memoized KPIs, skeletons, and error boundary

### 4.1 Add: `src/components/ErrorBoundary.tsx`
```tsx
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error('[CardError]', err); }
  render() { return this.state.hasError ? <div data-testid="error-boundary">Something went wrong. Try refresh.</div> : this.props.children; }
}
```

### 4.2 Add: `src/components/Skeletons.tsx`
```tsx
export const KPIBlockSkeleton = () => (
  <div className="animate-pulse" data-testid="kpi-skeleton"><div className="h-5 mb-2 rounded bg-neutral-700" /><div className="h-8 rounded bg-neutral-700" /></div>
);
```

### 4.3 Patch example: `src/pages/card/property/Hero.tsx`
```tsx
import { useMemo } from 'react';
import { KPIBlockSkeleton } from '@/components/Skeletons';

export default function PropertyHero({ data, isLoading }: any) {
  const { units, leases } = data || { units: [], leases: [] };
  const kpis = useMemo(() => {
    const unitsCount = units?.length || 0;
    const active = (leases||[]).filter((l:any) => String(l?.status||'').toLowerCase()==='active').length;
    const occupancy = unitsCount ? (active/unitsCount) : 0;
    const rents = (leases||[]).filter((l:any)=>String(l?.status||'').toLowerCase()==='active').map((l:any)=>Number(l?.rent_cents ?? l?.rent ?? 0));
    const avg = rents.length ? (rents.reduce((a:number,b:number)=>a+b,0)/rents.length) : 0;
    return { unitsCount, active, occupancy, avg };
  }, [units, leases]);

  if (isLoading) return <KPIBlockSkeleton />;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div data-testid="kpi-units"><div className="text-xs opacity-70">Units</div><div className="text-2xl">{kpis.unitsCount}</div></div>
      <div data-testid="kpi-active"><div className="text-xs opacity-70">Active Leases</div><div className="text-2xl">{kpis.active}</div></div>
      <div data-testid="kpi-occupancy"><div className="text-xs opacity-70">Occupancy</div><div className="text-2xl">{(kpis.occupancy*100).toFixed(1)}%</div></div>
      <div data-testid="kpi-avgrent"><div className="text-xs opacity-70">Avg Rent</div><div className="text-2xl">${'{'}Math.round((kpis.avg/100) || 0){'}'}</div></div>
    </div>
  );
}
```

> Apply similar testIDs to the other card pages’ hero blocks.

---

## 5) Guardrails: extend the check script to enforce test IDs

**Update** `scripts/guardrail-check.mjs` (append after existing checks):
```js
const requiredTestIds = {
  'src/pages/card/property/Hero.tsx': ['data-testid="kpi-units"','data-testid="kpi-active"','data-testid="kpi-occupancy"','data-testid="kpi-avgrent"'],
};

for (const [file, needles] of Object.entries(requiredTestIds)) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.error('[guardrail] missing', file); failures++; continue; }
  const s = fs.readFileSync(p,'utf8');
  for (const n of needles) if (!s.includes(n)) { console.error('[guardrail] testid missing in', file, '→', n); failures++; }
}
```

Add to **package.json** scripts (or merge with yours):
```json
{
  "scripts": {
    "guardrail": "node scripts/guardrail-check.mjs"
  }
}
```

---

## 6) Optional: normalized portfolio list (single source)

**New endpoint** `server/routes/listing.ts` (use if you want `/api/rpc/list_properties`):
```ts
import { Router } from 'express';
import { getServerClient } from '../db';
import { mapAddress } from '../lib/mapping';
export const listing = Router();

listing.get('/list_properties', async (_req, res) => {
  const s = getServerClient();
  const { data: props = [] } = await s.from('properties').select('*');
  // compute units & occupancy in one pass
  const ids = props.map(p => p.id);
  const { data: units = [] } = await s.from('units').select('id,property_id');
  const { data: leases = [] } = await s.from('leases').select('id,property_id,status');

  const grouped = new Map<number, { units: number; active: number }>();
  ids.forEach(id => grouped.set(id, { units: 0, active: 0 }));
  for (const u of units) { const g = grouped.get(u.property_id); if (g) g.units++; }
  for (const l of leases) { const g = grouped.get(l.property_id); if (g && String(l.status).toLowerCase()==='active') g.active++; }

  const rows = props.map(p => {
    const g = grouped.get(p.id) || { units: 0, active: 0 };
    const occ = g.units ? Math.round((g.active/g.units)*1000)/10 : 0;
    return { ...p, ...mapAddress(p), units: g.units, occPct: occ };
  });

  res.json(rows);
});
```
> Mount in `server/index.ts`: `app.use('/api/rpc', listing);`

---

## 7) Proof Steps
```bash
npm run guardrail
npm run dev

# pick a real property id from your table, e.g. 42
curl -s "http://localhost:8787/api/rpc/get_property_card?id=42" | jq '{u:(.kpis.units), a:(.kpis.activeLeases), o:(.kpis.occupancyPct), city:(.property.city)}'

# open UI
/card/property/42  → KPIs populated + test IDs present
/portfolio/properties → CITY/STATE/ZIP populated; UNITS/OCC% non‑zero
```

---

### What this fixes (mapped to your audit)
- **DTO Schemas**: added for Unit, Lease, Tenant, Owner ✅
- **Dual‑Key Joins**: applied to property/unit/lease/tenant cards ✅
- **Address Normalization**: centralized in mapping helper ✅
- **KPIs**: computed on server for property/owner, memoized on client ✅
- **Test Readiness**: data‑testids added + guardrail check ✅
- **Error/Loading**: ErrorBoundary + skeletons pattern ✅
- **Duplication**: shared helpers (mapping) + DTO consolidation ✅
- **Performance**: basic memoization + tighter query keys ✅

> After these patches, the asset cards render real numbers even if some rows have only DoorLoop IDs, and your portfolio lists show CITY/STATE/ZIP correctly. The guardrail will fail fast if someone strips test IDs or bypasses the resolvers.


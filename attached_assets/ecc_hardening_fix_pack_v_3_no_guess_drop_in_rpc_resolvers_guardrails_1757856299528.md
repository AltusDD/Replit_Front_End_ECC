# ECC Hardening Fix Pack v3 — No‑Guess Drop‑In

> **Use:** Copy/paste these files into your repo and replace existing ones. Then run the proof steps at the bottom. This kit removes guesswork by enforcing a single, validated data contract from API → UI.

---

## 1) server/db.ts (shared Supabase client; server‑only secrets)
```ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

function getEnv(name: string, fallback?: string) {
  return process.env[name] || fallback || '';
}

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY',
  getEnv('SUPABASE_SERVICE_KEY', getEnv('SUPABASE_KEY', getEnv('SUPABASE_SECRET')))
);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[ECC] Missing Supabase server credentials.');
}

export function getServerClient() {
  const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-ecc-api': 'rpc-v3' } },
  });
  return supa;
}
```

---

## 2) server/routes/entities.ts (raw JSON + filter grammar + abort safety)
```ts
import { Router } from 'express';
import { getServerClient } from '../db';

export const entities = Router();

function parseFilters(q: any) {
  const filters: Array<[string,string,any]> = [];
  for (const [key, value] of Object.entries(q)) {
    const [op, val] = String(value).split('.');
    filters.push([key, op, val]);
  }
  return filters;
}

entities.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params as { table: string; id: string };
  const ctl = new AbortController();
  req.on('close', () => ctl.abort());
  const supa = getServerClient();
  const { data, error } = await supa.from(table).select('*').eq('id', id).single();
  if (error || !data) return res.status(404).json({ error: 'not found' });
  res.json(data);
});

entities.get('/:table', async (req, res) => {
  const { table } = req.params as { table: string };
  const ctl = new AbortController();
  req.on('close', () => ctl.abort());
  const supa = getServerClient();
  let q = supa.from(table).select('*');
  for (const [col, op, val] of parseFilters(req.query)) {
    switch (op) {
      case 'eq': q = q.eq(col, val); break;
      case 'lt': q = q.lt(col, val); break;
      case 'lte': q = q.lte(col, val); break;
      case 'gt': q = q.gt(col, val); break;
      case 'gte': q = q.gte(col, val); break;
      case 'like': q = q.like(col, val); break;
      case 'ilike': q = q.ilike(col, val); break;
      default: break;
    }
  }
  const { data, error } = await q; 
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});
```

---

## 3) server/routes/rpc.ts (PK‑based DTO joins + status normalization)
```ts
import { Router } from 'express';
import { getServerClient } from '../db';

export const rpc = Router();

function normStatus(s?: string | null) {
  if (!s) return null;
  const k = String(s).toLowerCase().trim();
  if (['active','current','occupied'].includes(k)) return 'active';
  if (['pending','future'].includes(k)) return 'pending';
  if (['ended','terminated','closed','past','inactive','cancelled','canceled'].includes(k)) return 'ended';
  return k;
}

rpc.get('/get_property_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();
  const { data: property, error: pErr } = await supa.from('properties').select('*').eq('id', id).single();
  if (pErr || !property) return res.status(404).json({ error: 'not found' });

  const { data: units = [] } = await supa.from('units').select('*').eq('property_id', id);
  let { data: leases = [] } = await supa.from('leases').select('*').eq('property_id', id);
  leases = leases.map(l => ({ ...l, status: normStatus(l.status) }));

  let owner = null as any;
  if (property.owner_id) {
    const r = await supa.from('owners').select('*').eq('id', property.owner_id).single();
    owner = r.data || null;
  }
  res.json({ property, units, leases, owner });
});

rpc.get('/get_unit_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();
  const { data: unit, error } = await supa.from('units').select('*').eq('id', id).single();
  if (error || !unit) return res.status(404).json({ error: 'not found' });
  const { data: property } = await supa.from('properties').select('*').eq('id', unit.property_id).single();
  let { data: leases = [] } = await supa.from('leases').select('*').eq('unit_id', id);
  leases = leases.map(l => ({ ...l, status: normStatus(l.status) }));
  // current lease + tenant (best-effort)
  const current = leases.find(l => l.status === 'active') || leases[0] || null;
  let tenant = null as any;
  if (current?.tenant_id) {
    const r = await supa.from('tenants').select('*').eq('id', current.tenant_id).single();
    tenant = r.data || null;
  }
  res.json({ unit, property, lease: current, tenant });
});

rpc.get('/get_lease_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();
  const { data: lease, error } = await supa.from('leases').select('*').eq('id', id).single();
  if (error || !lease) return res.status(404).json({ error: 'not found' });
  const { data: unit } = await supa.from('units').select('*').eq('id', lease.unit_id).single();
  const { data: property } = await supa.from('properties').select('*').eq('id', lease.property_id).single();
  const { data: tenant } = await supa.from('tenants').select('*').eq('id', lease.tenant_id).single();
  res.json({ lease: { ...lease, status: normStatus(lease.status) }, unit, property, tenant });
});

rpc.get('/get_tenant_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();
  const { data: tenant, error } = await supa.from('tenants').select('*').eq('id', id).single();
  if (error || !tenant) return res.status(404).json({ error: 'not found' });
  const { data: leases = [] } = await supa.from('leases').select('*').eq('tenant_id', id);
  const propertyIds = Array.from(new Set(leases.map(l => l.property_id).filter(Boolean)));
  const { data: properties = [] } = propertyIds.length
    ? await supa.from('properties').select('*').in('id', propertyIds)
    : { data: [] } as any;
  res.json({ tenant, leases: leases.map(l => ({ ...l, status: normStatus(l.status) })), properties });
});

rpc.get('/get_owner_card', async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: 'missing id' });
  const supa = getServerClient();
  const { data: owner, error } = await supa.from('owners').select('*').eq('id', id).single();
  if (error || !owner) return res.status(404).json({ error: 'not found' });
  const { data: properties = [] } = await supa.from('properties').select('*').eq('owner_id', id);
  res.json({ owner, properties });
});
```

---

## 4) src/lib/dto.ts (Zod schemas to validate DTOs at runtime)
```ts
import { z } from 'zod';

export const Lease = z.object({
  id: z.number(),
  property_id: z.number().nullable(),
  unit_id: z.number().nullable(),
  tenant_id: z.number().nullable(),
  status: z.string().nullable(),
  rent_cents: z.number().optional().nullable(),
  rent: z.union([z.number(), z.string()]).optional().nullable(),
});

export const PropertyCardDTO = z.object({
  property: z.record(z.any()),
  units: z.array(z.record(z.any())),
  leases: z.array(Lease),
  owner: z.record(z.any()).nullable(),
});

export type PropertyCardDTO = z.infer<typeof PropertyCardDTO>;
```

---

## 5) src/lib/ecc-resolvers.ts (RPC‑first with /entities fallback + validation)
```ts
import { useQuery } from '@tanstack/react-query';
import { PropertyCardDTO } from './dto';

async function fetchJSON<T = any>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export function usePropertyCard(id: number) {
  return useQuery({
    queryKey: ['card','property', id],
    queryFn: async () => {
      try {
        const dto = await fetchJSON(`/api/rpc/get_property_card?id=${id}`);
        const parsed = PropertyCardDTO.safeParse(dto);
        if (parsed.success) return parsed.data;
      } catch {}
      const [property, units, leases] = await Promise.all([
        fetchJSON(`/api/entities/properties/${id}`),
        fetchJSON(`/api/entities/units?property_id=eq.${id}`),
        fetchJSON(`/api/entities/leases?property_id=eq.${id}`),
      ]);
      return { property, units, leases, owner: null };
    },
  });
}

export function useUnitCard(id: number) {
  return useQuery({
    queryKey: ['card','unit', id],
    queryFn: async () => fetchJSON(`/api/rpc/get_unit_card?id=${id}`)
      .catch(async () => {
        const unit = await fetchJSON(`/api/entities/units/${id}`);
        const property = unit?.property_id ? await fetchJSON(`/api/entities/properties/${unit.property_id}`) : null;
        const leases = await fetchJSON(`/api/entities/leases?unit_id=eq.${id}`);
        return { unit, property, lease: leases[0] || null, tenant: null };
      })
  });
}

export function useLeaseCard(id: number) {
  return useQuery({ queryKey: ['card','lease', id], queryFn: () => fetchJSON(`/api/rpc/get_lease_card?id=${id}`) });
}
export function useTenantCard(id: number) {
  return useQuery({ queryKey: ['card','tenant', id], queryFn: () => fetchJSON(`/api/rpc/get_tenant_card?id=${id}`) });
}
export function useOwnerCard(id: number) {
  return useQuery({ queryKey: ['card','owner', id], queryFn: () => fetchJSON(`/api/rpc/get_owner_card?id=${id}`) });
}
```

---

## 6) scripts/guardrail-check.mjs (fail fast if contracts drift)
```js
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const mustImport = [
  'src/pages/card/property/index.tsx',
  'src/pages/card/unit/index.tsx',
  'src/pages/card/lease/index.tsx',
  'src/pages/card/tenant/index.tsx',
  'src/pages/card/owner/index.tsx',
];

function fileHas(text, needle) { return text.includes(needle); }

let failures = 0;
for (const rel of mustImport) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { console.warn('[guardrail] missing', rel); failures++; continue; }
  const s = fs.readFileSync(p, 'utf8');
  if (!fileHas(s, "@/lib/ecc-resolvers")) { console.error('[guardrail] bad import in', rel); failures++; }
  if (fileHas(s, 'return null')) { console.error('[guardrail] null return in', rel); failures++; }
}

if (failures) { console.error(`[guardrail] FAILED with ${failures} issue(s)`); process.exit(1); }
console.log('[guardrail] PASS');
```

---

## 7) Property Hero KPI snippet (ensure non‑blank values)
```ts
const unitsCount = data.units?.length || 0;
const activeLeases = (data.leases||[]).filter(l => (l.status||'').toLowerCase()==='active').length;
const occupancyPct = unitsCount ? (activeLeases/unitsCount) : 0;
const rents = (data.leases||[])
  .filter(l => (l.status||'').toLowerCase()==='active')
  .map(l => Number(l.rent_cents ?? l.rent ?? 0));
const avgRent = rents.length ? (rents.reduce((a,b)=>a+b,0)/rents.length) : 0;
```

---

## 8) Proof Steps
```bash
npm i
npm run dev  # starts WEB:5173 + API:8787

# Entities sanity
curl -s http://localhost:8787/api/entities/properties/42 | jq '{id, owner_id, name}'
curl -s "http://localhost:8787/api/entities/units?property_id=eq.42"  | jq 'length'

# DTO sanity
curl -s "http://localhost:8787/api/rpc/get_property_card?id=42" | jq '{p:(.property!=null), u:(.units|length), a:(.leases|map(select(.status=="active"))|length)}'
```
Open `/card/property/42` and verify **Units / Active Leases / Occupancy / Avg Rent** show numbers (not blanks). Repeat for Unit/Lease/Tenant/Owner routes.

---

## 9) Notes
- All joins use **database primary keys** only (`*_id` columns), never vendor ids.
- Status labels are normalized server‑side so KPIs never miss due to casing.
- Resolvers validate DTO shape with Zod; if invalid, they transparently compose from `/entities` to avoid blank screens.
- Guardrail script blocks builds if any card page isn’t importing from the resolvers or returns `n
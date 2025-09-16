# ECC Genesis Sprint — Replit Command Pack v1 (CSP v2)

**Purpose:** Copy‑paste ready prompts and checklists to make Replit do the work — fast, verifiable, and Genesis‑grade. Use this file as your single command sheet until all 5 Asset Cards are live and passing guardrails.

---

## 0) Ground Rules (Paste to Replit AI before anything)
```
You are Replit AI assisting on the Altus Empire Command Center (ECC).
Follow the **CSP v2 Contract**:
1) One small milestone at a time.
2) After each milestone, show on‑screen proof (UI screenshot path, route URL, and a curl of the API).
3) No silent scope changes. If something is unclear, pause and ask.
4) Use the shared Supabase client (server/db.ts). Don’t access admin secrets from the browser.
5) Raw JSON from /api/entities/* and RPC DTOs from /api/rpc/* (flat fields). No wrappers.
6) Card pages must import hooks from src/lib/ecc-resolvers.ts and never return null.
7) Keep hook counts constant; no conditional hooks.
8) Admin operations go through BFF routes only; never expose admin tokens to the client.
9) Styling: use .ecc-object light‑grey section surfaces and keep Altus brand (black/gold). No orange.
Provide the minimal diff and the full file when replacements are large. Confirm each step before proceeding.
```

---

## 1) Repo Health & Startup (Terminal Commands for Replit Shell)
```
# Install deps (idempotent)
npm i

# Start dev (Vite 5173, API 8787)
npm run dev

# If there’s a second API process, ensure the API uses 8787
# and the client points to relative /api/*.
```

**Expected:** Vite at `http://localhost:5173` and API on `http://localhost:8787`.

---

## 2) Secrets & Environment Check (Ask Replit AI to verify)
```
Audit environment secrets:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (or alias SUPABASE_SERVICE_KEY / SUPABASE_KEY / SUPABASE_SECRET)

Tasks:
1) Confirm server/db.ts reads these and creates a single service-role Supabase client.
2) Ensure no admin secrets are referenced from VITE_* or client code.
3) If any client exposure exists, refactor to server-only.
4) Restart the server after any secret changes.
Provide file paths and a proof snippet showing server-only usage.
```

---

## 3) Ensure CSP v2 Files Exist (Prompt Replit AI to audit & replace)
```
Audit for presence and content of the following. Where mismatched, replace with Genesis-compliant versions:

SERVER (Express)
- server/index.ts (mounts routes, uses /api prefix)
- server/db.ts (shared Supabase client, multi-env auth)
- server/routes/entities.ts (raw JSON + simple filter grammar)
- server/routes/rpc.ts (BFF DTOs; joins on DB PKs only)

CLIENT (React)
- src/lib/ecc-resolvers.ts (RPC-first hooks: usePropertyCard, useUnitCard, useLeaseCard, useTenantCard, useOwnerCard; flat contracts; normalized query keys)
- src/pages/card/property/{Hero.tsx,RightRail.tsx,Tabs.tsx,Overview.tsx,index.tsx}
- src/pages/card/{unit,lease,tenant,owner}/* (cloned scaffolds)
- src/features/portfolio/components/{FieldRows.tsx,KPI.tsx,ActionButton.tsx,MiniCard.tsx,ActivityChip.tsx}
- src/styles/table.css + global tokens

Deliverables:
1) For each missing or divergent file, provide the full replacement file content.
2) Explain in 1–2 lines how it meets CSP v2 (flat DTOs, no wrappers, PK joins).
```

---

## 4) Backend Smoke Tests (Terminal)
```
# Replace 42 with a real property id once known
curl -s http://localhost:8787/api/entities/properties/42 | jq '{id, owner_id, name}'

curl -s "http://localhost:8787/api/entities/units?property_id=eq.42"  | jq 'length'
curl -s "http://localhost:8787/api/entities/leases?property_id=eq.42" | jq 'map(select(.status=="active"))|length'

curl -s "http://localhost:8787/api/rpc/get_property_card?id=42" | jq '{p:.property.id,u:(.units|length),a:(.leases|map(select(.status=="active"))|length)}'
```

**Expected:** Non‑empty results. Units count > 0; Active leases calculated.

---

## 5) UI Routes — Proof Paths (Have Replit AI open each)
```
Open these in preview (replace IDs with real ones):
/card/property/42  → Shows Units, Active Leases, Occupancy KPI
/card/unit/45      → Beds/Baths/Sqft + parent Property + Active Lease/Tenant (if present)
/card/lease/1      → Status, Rent, Term + linked entities
/card/tenant/1     → Lease list + related properties
/card/owner/1      → Portfolio list, counts
```

**Deliverable:** Replit AI posts screenshots or textual capture of each route rendering expected values.

---

## 6) Styling Enforcement (Prompt)
```
Ensure visual guardrails:
- All cards render inside .ecc-object light-grey surfaces for contrast.
- KPI tiles aligned and readable at common viewports.
- Remove any orange accents; use Altus black/gold only.
- No text clipping on tabs or flyouts; consistent spacing.
Provide the changed CSS/TSX snippets and a screenshot.
```

---

## 7) Guardrail Script & Checks (Prompt)
```
Run or add scripts/guardrail-check.mjs to validate:
- All card pages import hooks from @/lib/ecc-resolvers.
- Hook counts are constant; no conditional useQuery/useMemo patterns.
- No null returns from pages (render placeholders if needed).
- Client never calls admin/BFF write endpoints.
Output the guardrail report and fix any violations.
```

---

## 8) DoD — Definition of Done (Paste this gate)
```
A card is DONE when:
1) RPC returns non-empty DTO with flat fields (proof: curl + jq).
2) UI hero KPIs compute from fetched arrays (proof: visible KPIs and code snippet).
3) Tabs switch instantly; heavy tabs are lazy-loaded.
4) Page imports hooks from @/lib/ecc-resolvers and never returns null.
5) Guardrails pass.
6) No admin secrets in client; only server reads service-role key.
```

---

## 9) Milestone Plan (Replit AI Checklist)
- **M1:** Entities endpoints verified → proof via curl.
- **M2:** RPC endpoints verified → proof via curl.
- **M3:** Property Card hero + tabs render with live data.
- **M4:** Clone Unit, Lease, Tenant, Owner cards and wire hooks.
- **M5:** Styling enforcement (.ecc-object, KPIs, spacing, brand colors).
- **M6:** Guardrail script passes.

Replit AI must not progress to the next milestone without posting proof for the current one.

---

## 10) Quick‑Fix Prompts (Copy as needed)

### 10.1 Replace entities.ts with filter grammar
```
Create/replace server/routes/entities.ts that provides:
- GET /api/entities/:table/:id → single row (raw JSON)
- GET /api/entities/:table?field=op.value → arrays, supporting eq., lt., lte., gt., gte., like., ilike.
- AbortController tied to req.on('close').
Use Supabase JS server client from server/db.ts. Return raw rows; no wrappers.
```

### 10.2 Replace rpc.ts with DTO joins by PK
```
Create/replace server/routes/rpc.ts with endpoints:
- GET /api/rpc/get_property_card?id={id} → { property, units[], leases[], owner }
- GET /api/rpc/get_unit_card?id={id}     → { unit, property, lease?, tenant? }
- GET /api/rpc/get_lease_card?id={id}    → { lease, unit?, property?, tenant? }
- GET /api/rpc/get_tenant_card?id={id}   → { tenant, leases[], properties[] }
- GET /api/rpc/get_owner_card?id={id}    → { owner, properties[] }
All joins use normalized DB primary keys (e.g., leases.property_id → properties.id). No DoorLoop vendor IDs in joins.
Return flat DTOs (no raw.* namespace). Add abort safety on close.
```

### 10.3 Replace ecc-resolvers.ts with RPC‑first hooks
```
Create/replace src/lib/ecc-resolvers.ts exporting hooks:
- usePropertyCard(id) → queryKey ['card','property',id]
- useUnitCard(id)     → ['card','unit',id]
- useLeaseCard(id)    → ['card','lease',id]
- useTenantCard(id)   → ['card','tenant',id]
- useOwnerCard(id)    → ['card','owner',id]
Implementation:
- Try /api/rpc/*; on 404, gracefully fallback to /api/entities/* composition.
- Always return flat contracts with {property, units, leases, owner, ...} as applicable.
```

### 10.4 Property Card hero KPIs
```
In src/pages/card/property/Hero.tsx:
- unitsCount = units.length
- activeLeases = leases.filter(l => l.status==='active').length
- occupancy = unitsCount ? (activeLeases/unitsCount) : 0
- avgRent = mean of active leases' rent_cents (format as currency)
Render KPI components with these values.
```

### 10.5 Styling surface enforcement
```
Ensure each card page wraps sections in <section className="ecc-object"> … </section> with light-grey background and padded layout. Update CSS tokens if missing. Remove any orange styles; use Altus black/gold.
```

---

## 11) Gemini Partner Prompt (for deep code gen & audits)
```
Context: ECC — Genesis Asset Cards with CSP v2. Backend: Express on 8787 hitting Supabase via service-role in server/db.ts. Frontend: Vite + React + TanStack Query.

Task: Generate or audit the following files to ensure flat DTOs and consistent PK-based joins:
- server/routes/entities.ts (filter grammar, raw JSON, abort safety)
- server/routes/rpc.ts (get_property_card, get_unit_card, get_lease_card, get_tenant_card, get_owner_card)
- src/lib/ecc-resolvers.ts (RPC-first hooks with fallback)
- Property/Unit/Lease/Tenant/Owner card scaffolds and hero KPI logic
- scripts/guardrail-check.mjs (imports from @/lib/ecc-resolvers; constant hook counts; no null pages)

Requirements:
- No admin secrets in client.
- Flat fields in DTOs; UI reads data.property / data.units / data.leases / data.owner, etc.
- Provide full files with imports. Include quick proof instructions (curl and route URLs).
- After generation, produce a short “What changed & why” summary and a DoD checklist.
```

---

## 12) Troubleshooting Snippets
- **404 RPC** → Confirm server/routes/rpc.ts is mounted; restart dev server.
- **Blank KPIs** → Hit /api/entities/* endpoints to validate relationships; verify PK joins.
- **Supabase auth error** → Re-check SUPABASE_URL and service-role key aliases.
- **HMR abort warnings** → Benign; ensured abort safety in routes.

---

## 13) Final Gate — Sprint Acceptance
Before closing the sprint, capture:
- Terminal output of three curl proofs (entities, units length, RPC DTO).
- Screenshots (or console captures) of all five card routes rendering live values.
- Guardrail report showing 0 violations.

**Outcome:** Five live, data‑dense Asset Cards at Genesis standard, powered by CSP v2, with verifiable proofs and no client‑side secrets.


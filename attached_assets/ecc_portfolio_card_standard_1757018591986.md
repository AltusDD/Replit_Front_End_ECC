
# ECC Portfolio Card Pages — Product & Engineering Standard (v1.0)

**Scope**: This standard defines **how every Portfolio “Card” page** (Property, Unit, Lease, Tenant, Owner) is built, styled, wired to data, and tested in the Empire Command Center (ECC). It is written to be **copy‑pastable for Replit Agents** and enforce **No‑Drift** rules across the project.

Applies to:
- `Property Card` → `/card/property/:id`
- `Unit Card` → `/card/unit/:id`
- `Lease Card` → `/card/lease/:id`
- `Tenant Card` → `/card/tenant/:id`
- `Owner Card` → `/card/owner/:id`

---

## 1) Routing & Deep‑Link Contract

**URLs**
- Primary path: `/card/<entity>/<id>`
- Optional query params:
  - `?tab=<overview|details|financials|legal|files|linked|activity>`
  - `&sub=<subtab-id>`
  - `&highlight=<entityId>` (scroll into view and pulse on load)

**Breadcrumbs**
- `Portfolio › <Entity Plural> › <Entity Name>`
- Always rendered by `components/layout/Breadcrumbs.tsx`

**Route Guards**
- If `id` not found → 404 placeholder
- RBAC: Gate tabs and actions based on user roles/claims (see §12)

---

## 2) 3‑Column Layout (Responsive)

Grid (desktop):
- **Left**: Sidebar (existing ECC rail)
- **Main**: 760–980px fluid
- **Right Rail**: 320px fixed (read‑only context)

Breakpoints:
- `< 1280px`: right rail collapses under main as accordion
- `< 920px`: tabs become horizontal scroll, actions wrap

No‑Drift:
- **Right Rail is read‑only** (no writes). All mutations occur in main column.

---

## 3) Header (“Hero”) Block

**Top row (left → right)**
- Entity avatar/icon + Title (e.g., Property Address or Tenant Name)
- Secondary line: city • state • id short‑hash
- **Badges** (status): `Active | Vacant | Delinquent | Renewal 30d | In‑Legal | On Hold`
- **Quick KPIs** (see matrix below), each with 24h delta tooltip
- **Primary Actions** (role‑gated): Edit • Record Payment • New Work Order • Send Notice • Export PDF

**KPI Matrix (minimum per entity)**
- **Property**: Occupancy %, Units (#), Delinquency %, Open WOs, TTM NOI
- **Unit**: Status (Occupied/Turn/Vacant), Rent, Lease End, WO Open, Days Vacant
- **Lease**: Monthly Rent, Start/End, Balance, Last Payment, Days Late
- **Tenant**: Balance, Last Payment, Current Lease Ends, Notices YTD, Risk Score
- **Owner**: Units Managed, Occupancy %, Distributions YTD, Last Statement

---

## 4) Tabs & Content Definition

Tabs: `Overview · Details · Financials · Legal · Files · Linked · Activity`

### 4.1 Overview
- **Identity**: primary fields (address/contact) + quick edit
- **Linked Entities**: mini‑cards (Units, Leases, Tenants, Owner) with counts and drill‑ins
- **AI Alerts & Insights**: ranked list (ex: *Tenant risk ↑ due to 2 late payments*)
- **Recent Activity**: last 5 ledger/comms/work‑order events (read‑only)

### 4.2 Details
- Full field set in labeled sections:
  - Property: asset type, year built, sqft, parking, pets, utilities
  - Unit: beds/baths, sqft, floor, amenities
  - Lease: terms, rent schedule, deposits/obligo
  - Tenant: contact, employment, household
  - Owner: legal name, tax, banking (masked)

### 4.3 Financials
- **Unified Ledger View** (charges, payments, credits, fees) with filters: date, type, category, amount
- **Actions Panel**: Record Payment, Adjust Charge, Issue Credit, Start Payment Plan
- **Charts**: Cash Flow (charges vs payments), Aging (0/30/60/90+), Collections funnel
- **Advanced Audit** (collapsible): raw entry JSON, created_by, timestamps

### 4.4 Legal
- **Case Table**: case id, type, status, next date, attorney; open/closed filters
- **Escalation Actions**: Send to Legal, Generate Packet, Add Filing
- **Compliance**: missing docs, expirations

### 4.5 Files
- **Unified Explorer**: DoorLoop + Dropbox virtual folder
- Search, preview, upload (write behind for DoorLoop if needed)

### 4.6 Linked
- Full related lists with chips:
  - Units ⇄ Leases ⇄ Tenants ⇄ Owner
  - Work Orders (open last 90 days)
  - Attachments count

### 4.7 Activity
- Combined timeline (comms, ledger changes, WO updates)
- Source iconography (Email/Teams/SMS/DoorLoop)

---

## 5) Data Contracts (Typed)

All cards are delivered by **RPC endpoints** that return a **typed “Card DTO”** for the entity.

**Example: PropertyCardDTO**

```ts
export type Id = string;

export interface Kpi {
  label: string;
  value: string | number;
  deltaPct?: number;
}

export interface LinkedSummary {
  units: number;
  leases: number;
  tenants: number;
  owner?: { id: Id; name: string };
}

export interface PropertyCardDTO {
  id: Id;
  title: string;              // "1289 West 19th Ave"
  address: {
    line1: string; city: string; state: string; zip: string;
  };
  status: Array<"Active"|"Vacant"|"Delinquent"|"Renewal30"|"InLegal"|"OnHold">;
  kpis: Kpi[];
  linked: LinkedSummary;
  insights: string[];         // AI alert strings
}
```

**Endpoints (placeholder names)**
- `GET /api/rpc/get_property_card?id=<id>` → `PropertyCardDTO`
- `GET /api/rpc/get_unit_card?id=<id>` → `UnitCardDTO`
- `GET /api/rpc/get_lease_card?id=<id>` → `LeaseCardDTO`
- `GET /api/rpc/get_tenant_card?id=<id>` → `TenantCardDTO`
- `GET /api/rpc/get_owner_card?id=<id>` → `OwnerCardDTO`

**Fetching**
- SWR with entity‑scoped keys: `useSWR(['property-card', id], fetcher)`
- Revalidate on focus: **off** for ledger/financials tab (opt‑in refresh)

---

## 6) Component Contracts

- `CardHero.tsx` → Renders title, badges, KPIs, actions
- `CardTabs.tsx` → Hosts tab router + lazy mount
- `CardRightRail.tsx` → Context panels (read‑only)
- `CardSection.tsx` → Labeled sections; slots for edit/view
- `LedgerTable.tsx` → Virtualized table with sticky header
- `FilesExplorer.tsx` → Provider‑based integration wrapper
- `LinkedMiniCards.tsx` → Small cards with count + CTA

**Props are strictly typed** and **never accept raw hex colors**.

---

## 7) Table Standards (Applies to any tab using tables)

- Pagination (pageSize 25 default), client or server
- Sticky header, zebra rows, hover highlight
- Multi‑column sort, pin, hide/show columns
- Global search + per‑column filter
- Chips: status (gold outline), types (neutral), risk (heat scale)
- Keyboard nav + `aria` on headers/cells
- **Empty** / **Error** / **Loading Skeleton** states

---

## 8) Right Rail Standards

Right rail is **read‑only** and can include:
- Risk Score card (with click‑thru to AI Analytics)
- Last 5 payments (with links to Financials tab)
- Legal status widget (next date, attorney, quick view packet)
- Upcoming events (renewal, inspection)
- Quick files (pinned docs)

---

## 9) Styling & Tokens

Use only `src/styles/theme.css` tokens:
- Gold: `var(--gold)` / hover `var(--gold-2)`
- BG/Surface: `var(--bg)`, `var(--surface)`, `var(--panel)`
- Text: `var(--fg)`, `var(--muted-1)`, `var(--muted-2)`
- Borders: `var(--border-1)`

Typography:
- Headings: `Inter` (600/700)
- Body/UI: `IBM Plex Sans` (400/500/600)

Spacing:
- Base grid: 8px (compact), 12px (standard), 16px (content blocks)
- Card radius: 14px; button radius: 10px

---

## 10) Interactions & UX Rules

- Tabs lazy‑load content; preserve scroll per tab
- Copy‑to‑clipboard on IDs, addresses, emails
- Tooltips on KPIs (definition + source + last updated)
- Confirm dialogs on destructive actions
- Toasts for success/error (top‑right)

---

## 11) Performance

- SWR cache TTL defaults: 60s (Overview), 15s (Financials → manual refresh button)
- Virtualize large lists > 300 rows
- Prefetch linked entity cards on hover (owner, tenants)
- Avoid blocking on right‑rail data; load after main

---

## 12) Permissions (RBAC)

Roles (examples): `admin`, `accounting`, `ops`, `legal`, `investor`, `readOnly`

- Actions render only if `can(action)` returns true
- Tabs can be hidden per role (e.g., Legal for `investor`)
- API calls include `x-user-role` or JWT claims used by backend

---

## 13) Telemetry

Emit events:
- `card_loaded` `{entity,id,tab}`
- `card_action_clicked` `{entity,action}`
- `card_tab_changed` `{entity,tab}`
- `ledger_filter_applied` `{...}`

Wire to `window.altusAnalytics` or Segment (adapter pattern).

---

## 14) Error/Empty States

- 404: *We couldn’t find that {entity}.* CTA → respective list page
- Network error: retry with backoff + “Report issue” link
- Empty tables: helper text + CTA to create/attach

---

## 15) Definition of Done (per Card)

- [ ] All tabs render and lazy‑load
- [ ] Hero KPIs match matrix
- [ ] Actions wired with RBAC
- [ ] Right rail read‑only and populated
- [ ] SWR fetchers implemented for DTOs
- [ ] Playwright specs pass (sidebar + tab + ledger interactions)
- [ ] No raw hex, no mock literals
- [ ] Lighthouse perf >= 85 desktop

---

## 16) File Checklist to Scaffold (per Entity)

Create:
```
src/pages/card/<entity>/index.tsx           # Router wrapper
src/pages/card/<entity>/Hero.tsx
src/pages/card/<entity>/Tabs.tsx
src/pages/card/<entity>/Overview.tsx
src/pages/card/<entity>/Details.tsx
src/pages/card/<entity>/Financials.tsx
src/pages/card/<entity>/Legal.tsx
src/pages/card/<entity>/Files.tsx
src/pages/card/<entity>/Linked.tsx
src/pages/card/<entity>/Activity.tsx
src/pages/card/<entity>/RightRail.tsx
src/pages/card/<entity>/api.ts               # SWR hooks + DTO types
```

---

## 17) Replit Agent “Contract” (No‑Drift)

1. **Do not** place any tables inside `src/pages/dashboard`.
2. Implement/keep inline hover expansion for sidebar; **do not** render overlay pane.
3. Keep logo sizes: 150px expanded, 72px collapsed.
4. Use only theme tokens; **no raw hex** in components.
5. All table data flows from hooks; **no hardcoded rows**.
6. Add Playwright tests for:
   - `/card/property/:id` tabs load
   - ledger filters work
   - right rail stays read‑only

Return proofs:
- Screenshot of `/card/property/:id` with tabs visible
- Tree of `src/pages/card` folders
- `grep -rnw src/pages/dashboard -e "<table"` → empty

---

## 18) Quick Stubs (copy/paste)

**api.ts (example)**

```ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function usePropertyCard(id: string) {
  return useSWR(id ? `/api/rpc/get_property_card?id=${id}` : null, fetcher, { revalidateOnFocus: false });
}
```

**index.tsx (example wrapper)**

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePropertyCard } from './api';
import Hero from './Hero';
import Tabs from './Tabs';
import RightRail from './RightRail';

export default function PropertyCardPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = usePropertyCard(id);

  if (isLoading) return <div className="panel" style={{padding:16}}>Loading…</div>;
  if (error || !data) return <div className="panel" style={{padding:16}}>Not found.</div>;

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 320px', gap:16}}>
      <div>
        <Hero data={data}/>
        <Tabs data={data}/>
      </div>
      <RightRail data={data}/>
    </div>
  );
}
```
---

## 19) What “Good” Looks Like (visual checklist)

- Clean black/gold theme, crisp contrasts
- Strong typographic hierarchy (Inter + IBM Plex Sans)
- Hero KPIs consistent across entities
- Smooth tab switches; persistent filters
- No visual jitter when the right rail loads
- Links between related entities feel instant (prefetch on hover)

---

**Authoritative Note**: If Replit or any agent deviates, restore this file and reapply tests. This document is the contract.

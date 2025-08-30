# Empire Command Center — Frontend
- Theme tokens: `src/styles/theme.css`
- App globals: `src/styles/app.css`
- Canonical nav: `src/components/layout/navConfig.ts`
- UI kit: `src/components/ui`
- API client: `src/lib/useApi.ts`
- Develop: `npm run dev`
- Snapshot current state: `npm run snapshot` (writes to `./snapshots`)

## Quick Start (Replit)
1) Create a new Replit from this zip, or upload into an empty project.
2) Open the **Secrets** panel and (optionally) set:
   - `VITE_API_BASE` (default `/api`)
   - `VITE_ALLOWED_HOST` (your Replit host)
3) Click **Run** (or shell: `npm install && npm run dev`).

## Acceptance Checklist
- Probe page: ✅ `/api/health` and `/api/portfolio/*?limit=1` show status and first item.
- Portfolio pages: ✅ 5 pages, each renders "Loaded N ..." and a compact table.
- Dashboard: ✅ KPI cards sourced from V3; RPC shows "Not available yet" if 404.
- Guardrails: ✅ `scripts/vet.js` fails build on hardcoded `/api` or wrong imports.
- Build: ✅ `npm run build` completes with zero TS errors.

## Files of Interest
- `src/lib/ecc-api.ts` — hardened API client (getBase, normalizePath, buildUrl, fetchJSON, fetchCollection).
- `src/lib/api.ts` — back‑compat facade.
- `src/lib/useApi.ts` — abort‑safe hooks.
- `src/components/ui/*` — Badge, StatCard, Table.
- `src/pages/tools/ApiProbe.tsx` — V3 endpoint probe.
- `vite.config.mjs`, `tsconfig.json` — aliases `@` and `@lib`, dev proxy, allowedHosts.
- `scripts/vet.js` — tripwire to prevent future drift.

## Merging Your Existing Code
- Keep **this** `src/lib/ecc-api.ts` and aliases.
- Move any existing portfolio tables under `src/pages/portfolio/*` (never under `/dashboard`).
- Use **CSS variables** only (see `src/styles/theme.css`), no hex in components.
- Optional: add MUI DataGrid replacing `Table` component — the API client contract remains the same.

## Notes
- This baseline intentionally avoids heavy libs to keep the environment stable.
- You can layer Nav Fortress, Theme Foundation, and Playwright/Storybook on top.
- For RPC dashboards, wire your backend to `/api/rpc/*`; the UI will show live data without code changes.
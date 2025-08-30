# PATCHLOG — Genesis Baseline (v1.0.0)

## Added
- Hardened API client (`src/lib/ecc-api.ts`) with `/api` normalization and optional RPC behavior.
- Back-compat facade (`src/lib/api.ts`), abort-safe hooks (`src/lib/useApi.ts`), and helpers (`src/lib/safe.ts`).
- Core UI components: Badge, StatCard, Table.
- Pages:
  - Dashboard (KPI-first from V3, RPC optional badges)
  - Portfolio: properties, units, leases, tenants, owners
  - Tools: ApiProbe
- Guardrails: `scripts/vet.js` and config (`vite.config.mjs`, `tsconfig.json`, `.editorconfig`, `.eslintrc.cjs`, `.prettierrc`).
- Replit lock files: `.replit`, `replit.nix`.

## Deviations from Contract
- Minimal test scaffolding only (no Playwright/Storybook in this baseline zip) to keep footprint small.
  - Rationale: reduces friction for initial boot. You can layer tests via Hardening Kit v1.
- Simple table component instead of MUI DataGrid to minimize dependencies.
  - Rationale: You can swap in MUI later; API contracts unchanged.

## Migration Advice
- If your existing repo already has Nav Fortress / Theme Foundation, keep them and replace only the API client & pages as needed.
- Verify portfolio routes under `/portfolio/*` and remove any duplicates under `/dashboard`.

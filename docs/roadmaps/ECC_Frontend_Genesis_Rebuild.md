# ECC_Frontend_Genesis_Rebuild.md

## 📑 Scope
This document defines the step-by-step front-end rebuild plan for the **Empire Command Center (ECC)** GitHub repo (`AltusDD/Replit_Front_End_ECC`). It merges prior directives, playbooks, and project state files into a single execution order.

**Execution Order:**
1. Dashboard Fix
2. Portfolio Tables (Properties & Units)
3. Asset Cards (Genesis Phase 1)
4. Legal Page (restore + enhance)
5. Owner Transfer Page (relocate + harden)

---

## 1. Dashboard Fix

**PLAN**  
Operating Mode: UI-Nav Engineer, Consistency Enforcer  
Files to Touch:
- `src/features/dashboard/*`
- `src/components/kpi/*`
- `src/styles/_dashboard.css`

**Guardrails**
- Router: wouter only (no react-router-dom)
- No hardcoded KPIs → pull from Supabase/Azure endpoints
- Apply `.ecc-object` surface (light grey background per Architect's Directive【115†# Architect's Directive ECC Mark Down.txt】)

**CHANGESET**
- Repair KPI cards (Properties, Units, Occupancy, Revenue) with real DB values.
- Fix Recharts sparkline charts (live data, no placeholders).
- Remove all orange; apply Altus Black/Gold theme【103†ALTUS_REPLIT_HARDENING_PROJECT_STATE_2025-08-28.md】.
- Normalize box layout with consistent spacing per theme tokens.

**VERIFICATION**
- Dashboard loads without errors.
- KPI values non-null and match Supabase counts.
- Charts render with data.
- All boxes show `.ecc-object` styling.

---

## 2. Portfolio Tables

**PLAN**  
Operating Mode: UI-Nav Engineer  
Files to Touch:
- `src/features/portfolio/routes/PropertiesPage.tsx`
- `src/features/portfolio/routes/UnitsPage.tsx`

**Guardrails**
- Use **MUI DataGrid** with Altus-styled overrides【107†ECC Repo Organization & Tracking File Structure.docx】.
- Show **all fields** from DoorLoop (no trimming)【92†Altus Project Roadmap.docx】.
- Enable filter/sort/export.

**CHANGESET**
- Rebuild Properties table with MUI DataGrid.
- Rebuild Units table with MUI DataGrid.
- Add pagination, CSV export, clickable rows linking to Asset Cards.

**VERIFICATION**
- Properties table count = 181.
- Units table count = 176.
- Export produces CSV with all fields.
- Row click → navigates to corresponding Asset Card.

---

## 3. Asset Cards (Genesis Phase 1)

**PLAN**  
Operating Mode: Component Architect  
Files to Touch: `src/features/cards/*`, `src/components/ui/*`

**Guardrails**
- Build "atoms" first (FieldRows, KPI, ActionButton, MiniCard, ActivityChip)【115†# Architect's Directive ECC Mark Down.txt】.
- `.ecc-object` applied globally.
- Data fetching standardized with React Query (skeleton loaders mandatory).
- Heavy tabs (`Files`, `Activity`) lazy-loaded.

**CHANGESET**
- Create atomic components under `src/features/portfolio/components/`.
- Assemble Property Card → HeroBlock, RightRail, Tabs.
- Add placeholder integrations (Dropbox, CoreLogic, Field App) with "Coming Soon" tooltips.
- Repeat card structure for Unit, Lease, Tenant, Owner.

**VERIFICATION**
- `/card/property/:id` loads with 7-tab structure.
- Data populates via React Query.
- Tabs lazy-load correctly.
- Entity links work (Property ↔ Owner ↔ Tenant).

---

## 4. Legal Page (Restore + Enhance)

**PLAN**  
Operating Mode: UI-Nav Engineer  
Files to Touch: `src/features/legal/*`

**Context**  
We had a **working Legal Page stub** in earlier builds. This needs to be restored (if drifted) and expanded.

**Guardrails**
- Use ECC dark theme only.
- Pull live data from Supabase legal tables.
- Activity logs sourced from M365/Teams/Outlook if secrets available【108†ecc_m_365_core_update.txt】【109†ecc_m_365_secrets.txt】.

**CHANGESET**
- Restore existing Legal Page baseline.
- Add sortable case table (tenant, property, court date).
- Add filters: active, closed, escalated.
- Add activity feed: notices, Teams/Outlook comms.
- Future-ready: Planner task sync for court dates.

**VERIFICATION**
- `/legal` route loads successfully.
- Case data visible and accurate.
- Filters apply correctly.
- Activity feed populates with comms.

---

## 5. Owner Transfer Page (Relocate + Harden)

**PLAN**  
Operating Mode: Workflow Engineer  
Files to Touch: `src/features/owners/transfer/*`

**Guardrails**
- Must go through **BFF API** (`/api/bff/owner-transfer`)【115†# Architect's Directive ECC Mark Down.txt】.
- Remove direct `VITE_ADMIN_SYNC_TOKEN` references from frontend【115†# Architect's Directive ECC Mark Down.txt】.
- Accounting approval required (Teams/SharePoint packet drop【111†teams_pbx_migration_roadmap.md】).

**CHANGESET**
- Relocate Owner Transfer page to a more logical nav location (exact placement TBD with Dion).
- Build Approval → Authorize → Execute flow.
- Generate accounting packet (PDF/SharePoint file + Teams notification).
- Add full audit trail to transfer detail page.

**VERIFICATION**
- Transfer logs in Supabase.
- Teams notification fires (if secrets present).
- Accounting packet generated and stored.

---

## 🔑 Global Guardrails (From Hardening Docs)
- Stability > Magic: explicit `.replit`, `replit.nix`【103†ALTUS_REPLIT_HARDENING_PROJECT_STATE_2025-08-28.md】【104†Replit_Integration_Guide.md】.
- Feature-first repo structure【107†ECC Repo Organization & Tracking File Structure.docx】.
- Nav items added only in `src/config/navigation.ts` (SSOT).
- No raw hex: enforce Altus tokens【105†replit_assistant_playbook.md】.
- No hardcoded KPIs: database-first【115†# Architect's Directive ECC Mark Down.txt】.

---

## ✅ Next Steps
1. Apply this `.md` inside GitHub ChatGPT (4.1 or 5.0).
2. Execute fixes in sequence (Dashboard → Owner Transfer).
3. Run Playwright tests & audit scripts【112†ecc_replit_ui_playbook.md】【114†ecc_replit_audit_guide.md】.
4. Verify counts (181 properties, 176 units) and live data wiring.

---

**With this plan, ECC frontend will be Genesis-ready: stable dashboard, hardened portfolio tables, interactive Asset Cards, functional Legal Ops, and secure Owner Transfer workflow.**
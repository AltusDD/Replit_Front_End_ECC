# Pull Request Title

<!-- Concise description of what this PR does -->

---

## 📑 Overview
- [ ] Related Issue(s): Closes #ISSUE_NUMBER
- [ ] Milestone: Genesis Phase 1 (Frontend)
- [ ] Labels: [ ] frontend [ ] dashboard [ ] portfolio [ ] asset-cards [ ] legal [ ] owners [ ] infra

---

## 🛠️ Changes
<!-- List of changes grouped logically -->

- [ ] Dashboard Fix
- [ ] Portfolio Tables
- [ ] Asset Cards
- [ ] Legal Page
- [ ] Owner Transfer Page
- [ ] Global Guardrails/Infra

---

## 🔒 Guardrails Check
- [ ] Router: **wouter only** (no react-router-dom)
- [ ] No hardcoded KPIs (data from Supabase/Azure APIs only)
- [ ] All components styled with `.ecc-object` surface
- [ ] Theme = Altus black/gold (✅ no orange)
- [ ] Navigation added only in `src/config/navigation.ts`
- [ ] Atomic components used where applicable (FieldRows, KPI, ActionButton, MiniCard, ActivityChip)
- [ ] BFF endpoints used for admin operations (`/api/bff/*`)

---

## ✅ Verification Checklist
- [ ] Build compiles with no errors
- [ ] Dashboard KPIs = Properties 181, Units 176 (match Supabase)
- [ ] Tables use MUI DataGrid, export works
- [ ] Asset Cards load with skeleton loaders + lazy tabs
- [ ] Legal page loads, filters + activity feed working
- [ ] Owner Transfer flow: Approval → Authorize → Execute, logs + accounting packet
- [ ] Playwright/audit scripts run successfully
- [ ] No raw hex codes in CSS (tokens only)
- [ ] Git branch clean, commits descriptive

---

## 📸 Screenshots / Logs
<!-- Paste screenshots, curl outputs, or logs here for QA proof -->

---

## 🔗 Dependencies
- [ ] Dashboard completed before Portfolio/Asset Cards
- [ ] Owner Transfer after BFF + audit infra
- [ ] Global Guardrails always pass

---

## 🚀 Deployment Notes
- [ ] Secrets present in GitHub/Env (DOORLOOP_API_KEY, M365_*, DROPBOX_KEY)
- [ ] No `.env` values committed
- [ ] Feature flags validated via `/api/config/integrations`

---

## 📝 Reviewer Notes
- [ ] Confirm UI matches Genesis design
- [ ] Confirm counts match backend truth
- [ ] Confirm no drift from repo structure
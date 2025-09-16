# Empire Command Center — Roadmap Update: Microsoft 365 as Core Backbone

**Status:** Adopted (September 2025)  
**Scope:** Empire Command Center (ECC), Deal Room, Field App  
**Update:** Microsoft 365 (M365) is reclassified from "integration" to **Core Backbone Service**.

---

## 1. Executive Summary
Microsoft 365, including Teams, Outlook, SharePoint/OneDrive, Lists, and Planner, is now a **core operational backbone** of the Empire Command Center. It is no longer considered an optional integration. All ECC modules must assume M365 presence for communication, compliance, automation, and file storage.

PBX migration from Nextiva → Teams will complete in **September 2025**, locking Teams as the official voice and messaging platform.

---

## 2. Core M365 Components in ECC

- **Teams (PBX + Comms Hub)**  
  - Voice: full PBX replacement.  
  - Messaging: ECC-triggered events can generate Teams messages.  
  - Meetings: integration with ECC calendar and Legal Ops workflows.

- **Outlook**  
  - Email templates for tenants/owners.  
  - Auto-logging outbound comms.  
  - Shared inboxes tied to ECC actions (e.g., legal notices, owner statements).

- **SharePoint & OneDrive**  
  - Document system of record (leases, legal docs, financial exports).  
  - Linked into Asset Cards → Files tab (DoorLoop + Dropbox + SharePoint unified).

- **Planner & Tasks**  
  - Inspections, seasonal programs, and work order escalations.  
  - Directly linked to ECC entity actions (Property → Inspection Task).

- **Lists**  
  - Vendor performance.  
  - Inspection programs.  
  - Legal/compliance registers.

- **Purview (Compliance)**  
  - DLP on sensitive exports.  
  - Audit of tenant/owner comms.  
  - Compliance backbone for Phase 3 multi-state expansion.

---

## 3. Impact on ECC Modules

- **Asset Cards (Property, Unit, Lease, Tenant, Owner)**  
  - Hero actions can directly trigger M365 workflows (e.g., "Send Notice" via Outlook/Teams).  
  - Right-rail pinned files may pull from SharePoint.  
  - Activity tab shows Teams/Outlook comms as timeline chips.

- **Owner Transfers**  
  - Approvals trigger Teams notifications and optional Planner tasks.  
  - Accounting packet can be auto-dropped into SharePoint.

- **Legal Dashboard**  
  - Court dates → auto-create Planner tasks.  
  - Notices → Outlook/Teams templates.

- **Field App**  
  - Inspection tasks sync to Planner.  
  - Photos/docs → OneDrive → ECC asset file linkage.

- **Deal Room**  
  - Investor reports can be dropped to SharePoint/OneDrive.  
  - Communication logs auto-synced with Outlook.

---

## 4. Roadmap Positioning

### Phase 1 (Indiana MVP)
- M365 already provisioned and in use for email, file sharing, and Planner boards.  
- PBX migration to Teams completing Sept 2025.

### Phase 2 (Expansion)
- Deeper Planner/List integration with ECC workflows.  
- Tenant/Owner Comms Hub running directly through Teams + Outlook.  
- Compliance logging via Purview.

### Phase 3 (Multi-State + Licensing)
- Purview + M365 Copilot for compliance engine.  
- Multi-state comms compliance.  
- Investor-facing reporting pipelines via SharePoint.

---

## 5. Implementation Notes

- **Secrets / Auth**: M365 Graph API auth handled via Azure AD app registration. Keys stored in Replit/GitHub/Azure Key Vault depending on environment.  
- **RBAC**: ECC role gating maps to M365 roles (e.g., Accounting → Planner access).  
- **Fallback**: If M365 integration is down, ECC disables related actions with tooltips (no silent failure).

---

## 6. Placement Instructions

- **Repo Docs** → Drop this file under `docs/roadmap/` as `ECC_M365_Core_Backbone.md`.  
- **Project Management** → Attach to `Altus Project Roadmap.docx` as a supplemental reference.  
- **ECC Frontend** → Link this doc in `src/config/README.md` under "Core Backbones" section.  
- **Handoff Packages** → Include in `/handoff` bundles so Replit/Gemini know M365 is now a mandatory assumption.

---

**Action:** All future feature designs (Asset Cards, Legal Ops, Deal Room) must assume M365 connectivity. No design should treat it as optional.
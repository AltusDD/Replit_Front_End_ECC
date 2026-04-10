Canonical Component Adoption Plan — ECC

Status: CANONICAL

Approved Stack
- `cmdk` — whole
- `TanStack Table` — whole
- `shadcn/ui` — whole
- `dnd-kit` — whole
- `xstate` — evaluate by workflow burden
- `visx` — extract/custom overlay use only where needed
- `deck.gl` — extract/use only for justified geospatial surfaces
- `TanStack Query` — evaluate per adapter/data-governance fit

ECC Rules
- Conform to Type A command surface zoning: `T0` context, `T1` command bar, `T2` filters/search, `T3` table shell, `T4` footer/summary, `T5` optional drilldown rail.
- Preserve command-deck / holy-grail posture and premium black/white/gold styling.
- No adapter drift, no contract invention, no direct backend assumptions.
- Use existing ECC contract/client seams and current route registry.
- No orange.

Required Outcomes
- command palette shell
- canonical dense table shell
- drag-and-drop triage shell where domain-relevant
- implementation note with adopted vs deferred classifications
- proof-ready scope boundaries for frontend-only adoption

Acceptance
- dependency changes only where architecture-fit is confirmed
- implementation note
- scaffold entry points
- no backend drift
- no contract drift

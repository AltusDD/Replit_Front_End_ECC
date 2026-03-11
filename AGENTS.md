## Purpose
`Replit_Front_End_ECC` is the ECC frontend ownership layer for Altus. It contains the ECC user interface, local adapter and proxy surfaces, and frontend integration patterns used to consume backend contracts without redefining them.

## What Codex May Change
- Repo-local documentation, templates, and workflow metadata
- Non-destructive scaffolding that improves task intake, review, and handoff
- Low-risk developer workflow files that are manual-only and read-safe
- Frontend product code only when a task explicitly requests frontend changes

## What Codex Must Not Touch
- Deploy workflows, Azure configuration, runtime ownership, or backend target wiring
- API proxy targets, backend base URLs, or legacy runtime references unless explicitly instructed
- Backend business logic additions or backend contract invention
- Supabase wiring, secrets, or environment mutation
- Cross-repo automation or any workflow that mutates other repositories
- Push-triggered or scheduled write workflows
- Direct secret handling or repo visibility/settings unless explicitly requested

## Branch Naming
- Use `codex/*` branches for all Codex-authored changes
- Keep each branch limited to one task or one safe scaffold increment

## Validation Expectations
- Read the affected files before editing
- Keep changes ASCII unless the file already requires otherwise
- Validate workflow YAML for obvious syntax mistakes
- Prefer repo-local checks relevant to the touched area and summarize what was and was not validated in the PR
- Preserve adapter-based integration boundaries rather than inventing new direct contracts

## Secrets And Deploy Guardrails
- Never print, rotate, or rewrite secrets
- Never add workflows that require production credentials unless explicitly approved
- Prefer `workflow_dispatch` for new coordination workflows in this repo
- Do not add scheduled or push-triggered jobs that can change infrastructure, data, or product state
- Treat frontend-to-backend adapters, API proxy configuration, Supabase env usage, and legacy runtime references as guarded surfaces

## Pull Request Expectations
- Keep PRs narrow and reversible
- Describe scope boundaries and any systems intentionally left untouched
- Call out workflow, runtime, adapter, contract, or env impact explicitly
- Include rollback notes for any scaffold or workflow change

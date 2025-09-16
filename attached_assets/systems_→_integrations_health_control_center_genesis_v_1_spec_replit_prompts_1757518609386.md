# Systems → Integrations Health & Control Center (Genesis v1)

**Status:** Ready for Build • **Scope:** DoorLoop v1 (extensible to M365, Dropbox, CoreLogic) • **Owner:** Systems

---

## 1) Objective
Create a permanent, Genesis‑grade **Integrations Health & Control Center** at `/systems/integrations` with one‑click **connectivity ping, scheduler controls, manual runs/backfills, live logs, rate‑limit telemetry, dead‑letter requeue, and alerting to Teams**. This replaces guesswork, shell scripts, and hidden failures.

---

## 2) Feature Set ("bells & whistles")

### A. Connectivity & Auth
- **Ping** for each integration (DoorLoop now; others later) → shows `ok / degraded / failing` with reason.
- Extract & display **rate limit headers** (e.g., `X-RateLimit-Remaining`, `X-RateLimit-Reset`) when present.
- **Env & config sanity check**: base URL, token presence/shape, masking secrets; highlights common mistakes (e.g., hitting ReadMe docs host instead of API host).

### B. Scheduler & Controls
- Read‑only view of **AUTO_SYNC** state: enabled flag, interval, entities, nightly full schedule, lock status.
- **Run now** (delta) & **Backfill** (full, paginated) with entity multi‑select.
- **Stop** / cancel active run with lock release.
- **RBAC gate**: Admin‑only controls, everything logged (who/when/what) to `admin_logs`.

### C. Live Logs & Telemetry
- **SSE live log stream** with filters (entity, level, runId).
- Progress: entity → page → rows processed; ETA; moving average rps.
- **Error fingerprinting** (status code + path + snippet) and aggregation.
- **Rate‑limit monitor** chart (remaining vs time) with backoff/jitter strategy display.

### D. Reliability Mechanics
- **Retry policy** (bounded exponential backoff, jitter) + **circuit breaker** if error rate crosses threshold.
- **Dead‑letter queue (DLQ)** for failed records with reason, payload hash, createdAt; **Requeue** button.
- **Partial resume**: resume from last successful page/ID per entity.

### E. Data Safety & Provenance
- **Sandbox/Dry‑run mode**: parse & count only, no DB writes; emits a delta report.
- **Schema diff**: sample DoorLoop payload keys vs Supabase table columns (high‑level, non‑destructive).
- **Provenance tags** attached to synced rows (source=doorloop, fetch_time, runId).

### F. Alerts & SLOs
- **Teams webhook alerts**: connectivity failing, 12h without a successful run, circuit breaker open, nightly full failed.
- **Health score** for each integration (0–100) computed from freshness, success rate, and error rate.

### G. UI/UX (Genesis)
- 3‑column layout: **Main** (cards, runs, logs), **Right rail** (scheduler & config), **Sticky header** with global actions.
- Uses tokens & Tailwind; no inline styles. Keyboard accessible; AA contrast.

---

## 3) Server API (new/confirmed)

> All new routes live under `/api/admin` and reuse the new centralized DoorLoop client.

### DoorLoop
- `GET /api/admin/integrations/doorloop/ping`
  - Returns: `{ ok, baseUrl, authenticated, sampleCount, elapsedMs, rateLimit?: {limit, remaining, reset} }`
- `GET /api/admin/integrations/doorloop/check?endpoint=owners&page_size=1`
  - Returns: status, first item keys, count; surfaces 404/401 with readable message.

### Sync Core
- `GET /api/admin/sync/status`
  - Returns scheduler state, nextRun, lastSuccess/Failure per entity, active run lock.
- `POST /api/admin/sync/run`  
  Body: `{ entities: string[], mode: "delta"|"backfill", since?: string, dryRun?: boolean }`
- `POST /api/admin/sync/stop`  
  Cancels current run if any; releases lock.
- `GET /api/admin/sync/logs/stream` (SSE)
  - Events: `{ type, ts, entity, page, rows, level, msg, runId }`
- `GET /api/admin/sync/runs?limit=50` → historical runs
- `POST /api/admin/sync/dlq/requeue` Body `{ id }`
- `GET /api/admin/sync/dlq?entity=owners` → list recent DLQ items

**Notes**
- Rate limit headers captured from client; attach to ping, status, and per‑page events.
- All admin writes record to `admin_logs` with user, action, payload summary, result.

---

## 4) UI Spec @ `/systems/integrations`

**Main Column**
1) **DoorLoop StatusCard**
   - State chip (✅/⚠️/❌), Base URL, Auth OK, Rate Limit (limit/remaining/reset clock), Last success, Last error.
   - **Ping** button.
2) **RunPanel**
   - Entity checkboxes (owners, properties, units, leases, tenants)
   - Mode: Delta / Backfill; optional `since` date; **Dry‑run** toggle
   - Buttons: **Run now**, **Stop**
   - **Progress bar** + current page/rows; **ETA**, **RPS**
3) **LastRunTable** (last 20)
   - Columns: Started, Entity, Mode, Rows, Duration, Result, RunId
   - Row click → **ErrorPane** drawer with full message & first 2KB of response
4) **LiveLogs**
   - SSE terminal with filters, copy‑to‑clipboard, pause

**Right Rail**
- **Scheduler Card**: Enabled ✔/✖, Interval (minutes), Next run, Nightly full (UTC), Entities; note if env‑locked
- **Config Preview**: masked secrets, base URL, page size, concurrency; warns on missing/invalid values
- **Alerts Card**: Teams webhook set ✔/✖, last alert, test alert button
- **DLQ Panel**: count, top 10 recent with Requeue buttons

---

## 5) Reliability & Backpressure
- **Retry**: 429/5xx → exponential backoff (base=500ms, factor=1.8, cap=20s) + jitter
- **Circuit breaker**: open after N consecutive hard failures (configurable), cool‑down 60s; admin can force‑close
- **Pagination guard**: detects HTML error payloads (e.g., ReadMe page) and halts with actionable error
- **Concurrency**: per‑entity concurrency (default 1–2), global limiter; progressive ramp‑up

---

## 6) Env & Config (Replit Secrets)
```
DOORLOOP_BASE_URL=https://app.doorloop.com/api
DOORLOOP_API_KEY=***
DOORLOOP_PAGE_SIZE=100
DOORLOOP_MAX_CONCURRENCY=2
DOORLOOP_RATE_LIMIT_RPS=4

AUTO_SYNC_ENABLED=true
AUTO_SYNC_INTERVAL_MINUTES=10
SYNC_ENTITIES=owners,properties,units,leases,tenants
AUTO_SYNC_FULL_AT_HOUR_UTC=5

INTEGRATIONS_TEAMS_WEBHOOK=https://***
ALLOW_MANUAL_BACKFILL=true
```

---

## 7) Replit — Master Build Prompt (paste in Build mode)

**PLAN (Operating Mode: UI‑Nav Engineer, Consistency Enforcer, Infra Wrangler)**
**Goal:** Implement the Systems → Integrations Health page with server routes, SSE logs, DLQ, retries, and alerting.

**FILES TO TOUCH**
- `server/clients/doorloop.ts` (already exists; add rate‑limit header extraction)
- `server/routes/admin/integrations.ts` (add ping/check)
- `server/routes/admin/sync.ts` (status/run/stop/logs/runs/dlq)
- `server/lib/sync/*` (emit structured events for SSE; DLQ on hard failures)
- `src/features/systems/integrations/*` (new React pages/components)
- `src/styles/*` (no inline styles; use tokens)

**GUARDRAILS**
- No secrets in logs. Mask tokens. All admin actions logged.
- RBAC: Admin only; return 403 otherwise.
- SSE must auto‑reconnect; buffer last 200 events client‑side.

**CHANGESET**
1) **Server**
   - Add routes listed in Section 3; wire to centralized client; capture headers → `rateLimit`.
   - Implement run orchestration with lock, progress, DLQ, retries, circuit breaker.
   - Add `admin_logs` write on run start/stop/backfill.
2) **UI**
   - Build components from Section 4 using Tailwind + tokens; 3‑column Genesis layout.
   - Hook RunPanel to `/run`, `/stop` and poll `/status`; LiveLogs via SSE.
   - ErrorPane and DLQ requeue actions.
   - Alerts card with **Send test alert** (POST to webhook).
3) **Telemetry**
   - Compute health score (0–100) from freshness + success rate + error rate.
   - Rate‑limit mini‑chart (sparkline) from recent events.

**VERIFICATION CHECKLIST**
- `/api/admin/integrations/doorloop/ping` returns JSON and flips ❌→✅ when key/baseUrl are correct.
- `/systems/integrations` shows live scheduler status, can Run now, Backfill, Stop, and stream logs.
- DLQ captures failures, and requeue works.
- Teams alert fires on forced failure and test alert.
- Circuit breaker opens on repeated 5xx, prevents hammering, and auto‑closes.

---

## 8) Minimal Code Blocks (reference)

**Rate‑limit capture (client)**
```ts
export function parseRateLimit(h: Headers) {
  const limit = h.get("x-ratelimit-limit");
  const remaining = h.get("x-ratelimit-remaining");
  const reset = h.get("x-ratelimit-reset");
  return (limit||remaining||reset) ? { limit: num(limit), remaining: num(remaining), reset: num(reset) } : undefined;
  function num(v?: string|null){ return v? Number(v): undefined; }
}
```

**SSE route skeleton**
```ts
// GET /api/admin/sync/logs/stream
res.setHeader("Content-Type","text/event-stream");
res.setHeader("Cache-Control","no-cache");
res.flushHeaders();
const send = (e:any)=>res.write(`event: log\ndata: ${JSON.stringify(e)}\n\n`);
// on progress/error emit send({...})
req.on("close", ()=> {/* unsubscribe */});
```

**Teams alert helper**
```ts
export async function sendTeams(text: string){
  const url = process.env.INTEGRATIONS_TEAMS_WEBHOOK; if(!url) return;
  await fetch(url,{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ text }) });
}
```

---

## 9) Runbook (Day‑to‑day)
- Visit **Systems → Integrations**.
- Click **Ping**. If ❌, fix base URL/token.
- For missing data, choose entities, toggle **Dry‑run** first → review counts → **Run now**.
- Watch **Live logs** and **Rate‑limit**; adjust concurrency if needed.
- If failures appear in DLQ, **Requeue** after fix.
- Ensure nightly full completes; watch Teams for alerts.

---

## 10) Acceptance Criteria
- One‑click diagnosis of DoorLoop: ✅ ping, auth, and rate‑limit visible.
- Manual **Run now** & **Backfill** with progress, logs, and DLQ; stop works.
- Health score and alerts to Teams wired.
- RBAC enforced; no secrets leaked; tokens masked.
- Page meets Genesis layout & a11y; zero inline styles; responsive.

---

## 11) Future Extensibility (M365/Dropbox/CoreLogic)
- Duplicate ping/check modules per integration.
- Add unified **Integration Registry** for icon, color, endpoints, and rate‑limit semantics.
- Reuse RunPanel for Dropbox backfills and CoreLogic enrichers.


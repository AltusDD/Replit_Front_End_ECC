// server/lib/sync/auto.ts
import { sbAdmin } from "../supabaseAdmin";
import { runSync } from "./index";
import { upsertState, getState } from "../integrationState";

const S_LOCK = "AUTO_SYNC_LOCK";
const S_STATUS = "AUTO_SYNC_STATUS";
const S_LAST_FULL = "doorloop_last_full";
const S_LAST_INCR = "doorloop_last_incr";

function env(name: string, fallback?: string) {
  return (process.env[name] ?? fallback ?? "").trim();
}

function nowIso() {
  return new Date().toISOString();
}

async function withDbLock<T>(ttlMinutes: number, fn: () => Promise<T>): Promise<T | null> {
  const startedAt = nowIso();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const holder = `auto-sync-${Date.now()}`;
  
  // Attempt to acquire lock if not held or expired
  const current = await getState(S_LOCK);
  const okToLock = (() => {
    if (!current?.value) return true;
    const v = current.value as any;
    if (!v.locked) return true;
    const expiry = v.expires_at ? Date.parse(v.expires_at) : 0;
    return Date.now() > expiry; // expired
  })();

  if (!okToLock) return null;

  // Acquire lock with TTL
  await upsertState(S_LOCK, { 
    locked: true, 
    holder, 
    expires_at: expiresAt,
    acquired_at: startedAt 
  });

  try {
    const result = await fn();
    return result;
  } finally {
    // Release lock
    await upsertState(S_LOCK, { 
      locked: false, 
      holder: null, 
      expires_at: null,
      released_at: nowIso() 
    });
  }
}

async function audit(event_type: string, payload: any) {
  // Best-effort audit, don't throw
  try {
    await sbAdmin
      .from("audit_events")
      .insert({
        event_type,
        ref_table: "sync",
        payload,
        created_at: new Date().toISOString(),
        // leave actor_id null — this is system
        // add a label to filter later if you want:
        label: "AUTO_SYNC",
      })
      .throwOnError();
  } catch {}
}

function parseEntityList(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function shouldDoNightlyFull(nowUtc: Date, hourStr: string | undefined, lastFullIso?: string): boolean {
  if (!hourStr) return false;
  const targetHour = Number(hourStr);
  if (!Number.isFinite(targetHour)) return false;

  const lastFullDay = lastFullIso ? new Date(lastFullIso).toISOString().slice(0, 10) : "";
  const today = nowUtc.toISOString().slice(0, 10);
  const isNewDay = today !== lastFullDay;
  const isTargetHour = nowUtc.getUTCHours() === targetHour;
  return isNewDay && isTargetHour;
}

export function startAutoSyncLoop() {
  const enabled = env("AUTO_SYNC_ENABLED", "false").toLowerCase() === "true";
  const apiKeyPresent = !!env("DOORLOOP_API_KEY");
  
  const intervalMin = Math.max(2, Number(env("AUTO_SYNC_INTERVAL_MINUTES", "10")));
  const fullAtHour = env("AUTO_SYNC_FULL_AT_HOUR_UTC", ""); 
  const entities = parseEntityList(env("SYNC_ENTITIES", "owners,properties,units,leases,tenants"));
  const lockTtlMin = Math.max(5, Number(env("AUTO_SYNC_LOCK_TTL_MINUTES", "20")));
  const hardDeadlineMin = Math.max(10, Number(env("AUTO_SYNC_HARD_DEADLINE_MINUTES", "30")));

  if (!enabled) {
    console.log("[auto-sync] disabled via AUTO_SYNC_ENABLED");
    return;
  }

  const tick = async () => {
    const now = nowIso();
    const nextRunAt = new Date(Date.now() + intervalMin * 60 * 1000).toISOString();

    try {
      // Update status - always track that we attempted a run
      await upsertState(S_STATUS, {
        last_run_at: now,
        next_run_at: nextRunAt,
        mode: "pending"
      });

      if (!apiKeyPresent) {
        console.log("[auto-sync] DOORLOOP_API_KEY missing; scheduling next tick");
        await audit("AUTO_SYNC_TICK", { 
          status: "skipped", 
          reason: "missing_api_key",
          next_run_at: nextRunAt 
        });
        return;
      }

      // Check for catch-up scenario
      const status = (await getState(S_STATUS))?.value;
      const lastSuccess = status?.last_success_at;
      const needsCatchUp = lastSuccess && 
        (Date.now() - Date.parse(lastSuccess)) > (hardDeadlineMin * 60 * 1000);

      if (needsCatchUp) {
        console.log("[auto-sync] catch-up needed - last success too old");
        await audit("AUTO_SYNC_CATCHUP", { 
          last_success_at: lastSuccess,
          deadline_minutes: hardDeadlineMin
        });
      }

      // Decide mode: nightly full or incremental
      const lastFull = (await getState(S_LAST_FULL))?.value?.when as string | undefined;
      const doFull = shouldDoNightlyFull(new Date(), fullAtHour || undefined, lastFull);
      const mode = doFull ? "full" : "incremental";

      const ran = await withDbLock(lockTtlMin, async () => {
        const started_at = nowIso();
        
        // Update status to running
        await upsertState(S_STATUS, {
          last_run_at: now,
          next_run_at: nextRunAt,
          mode: mode,
          status: "running",
          started_at
        });

        await audit("AUTO_SYNC_STARTED", { mode, entities, started_at });

        const result = await runSync(entities as any[], mode as "full" | "incremental");

        const finished_at = nowIso();
        await audit("AUTO_SYNC_FINISHED", {
          mode,
          entities,
          started_at,
          finished_at,
          result,
        });

        // Update success status and checkpoints
        await upsertState(S_STATUS, {
          last_run_at: now,
          last_success_at: finished_at,
          next_run_at: nextRunAt,
          mode: mode,
          status: "completed"
        });

        if (mode === "full") {
          await upsertState(S_LAST_FULL, { when: finished_at });
        } else {
          await upsertState(S_LAST_INCR, { when: finished_at });
        }
        return result;
      });

      if (!ran) {
        console.log("[auto-sync] skipped — lock held");
        await audit("AUTO_SYNC_TICK", { 
          status: "skipped", 
          reason: "lock_held",
          next_run_at: nextRunAt 
        });
      }
    } catch (err: any) {
      console.error("[auto-sync] error:", err?.message || err);
      await audit("AUTO_SYNC_ERROR", { 
        message: String(err?.message || err),
        next_run_at: nextRunAt
      });
      
      // Update status to show error
      await upsertState(S_STATUS, {
        last_run_at: now,
        next_run_at: nextRunAt,
        mode: "error",
        status: "failed",
        error: String(err?.message || err)
      });
    }
  };

  // initial small delay to avoid clashing with boot
  setTimeout(tick, 2500);
  // steady state loop
  setInterval(tick, intervalMin * 60 * 1000);
  console.log(`[auto-sync] enabled every ${intervalMin}m; lock TTL: ${lockTtlMin}m; deadline: ${hardDeadlineMin}m; nightly full at UTC hour: ${fullAtHour || "disabled"}`);
}
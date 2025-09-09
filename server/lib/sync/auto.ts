// server/lib/sync/auto.ts
import { sbAdmin } from "../supabaseAdmin";
import { runSync } from "./index";
import { upsertState, getState } from "../integrationState";

const S_LOCK = "doorloop_sync_lock";
const S_LAST_FULL = "doorloop_last_full";
const S_LAST_INCR = "doorloop_last_incr";

function env(name: string, fallback?: string) {
  return (process.env[name] ?? fallback ?? "").trim();
}

function nowIso() {
  return new Date().toISOString();
}

async function withDbLock<T>(ttlSeconds: number, fn: () => Promise<T>): Promise<T | null> {
  const startedAt = nowIso();
  const lockPayload = { in_progress: true, started_at: startedAt, ttl: ttlSeconds };

  // Attempt to acquire lock if not held or expired
  const current = await getState(S_LOCK);
  const okToLock = (() => {
    if (!current?.value) return true;
    const v = current.value as any;
    if (!v.in_progress) return true;
    const then = v.started_at ? Date.parse(v.started_at) : 0;
    const ageSec = (Date.now() - then) / 1000;
    return ageSec > (v.ttl ?? ttlSeconds); // expired
  })();

  if (!okToLock) return null;

  await upsertState(S_LOCK, lockPayload);

  try {
    const result = await fn();
    return result;
  } finally {
    await upsertState(S_LOCK, { in_progress: false, finished_at: nowIso() });
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
  if (!enabled) {
    console.log("[auto-sync] disabled via env");
    return;
  }
  if (!apiKeyPresent) {
    console.log("[auto-sync] DOORLOOP_API_KEY missing; auto-sync idle");
    return;
  }

  const intervalMin = Math.max(2, Number(env("AUTO_SYNC_INTERVAL_MINUTES", "10")));
  const fullAtHour = env("AUTO_SYNC_FULL_AT_HOUR_UTC", ""); // optional
  const entities = parseEntityList(env("SYNC_ENTITIES", "owners,properties,units,leases,tenants"));
  const lockTtlSec = Math.max(120, intervalMin * 60 - 10); // slightly under interval

  const tick = async () => {
    try {
      // Decide mode: nightly full or incremental
      const now = new Date();
      const lastFull = (await getState(S_LAST_FULL))?.value?.when as string | undefined;

      const doFull = shouldDoNightlyFull(now, fullAtHour || undefined, lastFull);

      const mode = doFull ? "full" : "incremental";

      const ran = await withDbLock(lockTtlSec, async () => {
        const started_at = nowIso();
        await audit("SYNC_STARTED", { mode, entities, started_at });

        const result = await runSync(entities as any[], mode as "full" | "incremental");

        await audit("SYNC_FINISHED", {
          mode,
          entities,
          started_at,
          finished_at: nowIso(),
          result,
        });

        // update checkpoints
        if (mode === "full") {
          await upsertState(S_LAST_FULL, { when: nowIso() });
        } else {
          await upsertState(S_LAST_INCR, { when: nowIso() });
        }
        return result;
      });

      if (!ran) {
        // Another sync is still running
        console.log("[auto-sync] skipped — lock held");
      }
    } catch (err: any) {
      console.error("[auto-sync] error:", err?.message || err);
      await audit("SYNC_ERROR", { message: String(err?.message || err) });
    }
  };

  // initial small delay to avoid clashing with boot
  setTimeout(tick, 2500);
  // steady state loop
  setInterval(tick, intervalMin * 60 * 1000);
  console.log(`[auto-sync] enabled every ${intervalMin}m; nightly full at UTC hour: ${fullAtHour || "disabled"}`);
}
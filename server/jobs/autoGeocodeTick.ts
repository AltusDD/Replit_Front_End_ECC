import { sbAdmin } from "../lib/supabaseAdmin";
import { geocodeAddress } from "../lib/geocode/geocode";
import { recordAudit } from "../lib/audit";

async function getState(key: string) {
  const { data } = await sbAdmin.from("integration_state").select("value").eq("key", key).maybeSingle();
  return data?.value ?? null;
}

async function setState(key: string, value: any) {
  await sbAdmin.from("integration_state").upsert({ key, value });
}

export async function runAutoGeocodeTick() {
  // prefer integration_state override, else env, else 10
  const overrideBatch = (await getState("GEOCODE_TICK_BATCH")) ?? null;
  const BATCH = Number.isFinite(Number(overrideBatch)) ? Number(overrideBatch) : parseInt(process.env.GEOCODE_TICK_BATCH || "10", 10);

  const { data: props, error } = await sbAdmin
    .from("properties")
    .select("id,line1,line2,city,state,postal_code,lat,lng")
    .or("lat.is.null,lng.is.null")
    .limit(BATCH);

  if (error) return;

  let done = 0;
  const processed = (props || []).length;
  
  for (const p of (props || [])) {
    try {
      const res = await geocodeAddress({ 
        line1: p.line1, 
        line2: p.line2, 
        city: p.city, 
        state: p.state, 
        postal_code: p.postal_code 
      });
      
      if (res) {
        const { error: upErr } = await sbAdmin
          .from("properties")
          .update({ lat: res.lat, lng: res.lng })
          .eq("id", p.id);
          
        if (!upErr) {
          await recordAudit({ 
            event_type: "GEOCODE_AUTO_APPLY", 
            label: "GEOCODE_AUTO", 
            ref_table: "properties", 
            ref_id: p.id, 
            payload: res 
          });
          done++;
        }
      }
    } catch { 
      /* swallow batch errors */ 
    }
  }
  
  // Update state with run statistics
  await setState("GEOCODE_LAST_RUN", { 
    ts: new Date().toISOString(), 
    processed, 
    updated: done,
    batch_size: BATCH
  });
}

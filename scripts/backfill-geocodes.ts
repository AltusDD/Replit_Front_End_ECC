// npx tsx scripts/backfill-geocodes.ts
import { createClient } from "@supabase/supabase-js";
import { geocode } from "../server/lib/geocode.js";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Supabase setup (same as server)
function coerceRestUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const rest = raw.match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i);
  if (rest) return `https://${rest[1]}.supabase.co`;
  const m = raw.match(/@db\.([a-z0-9-]+)\.supabase\.co/i);
  if (m) return `https://${m[1]}.supabase.co`;
  return raw;
}

const rawUrl = process.env.SUPABASE_URL || process.env.SUPABASE_REST_URL || null;
const restUrl = coerceRestUrl(rawUrl);
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!restUrl || !key) {
  console.error("❌ Missing Supabase REST URL and/or key");
  process.exit(1);
}

const supabase = createClient(restUrl, key, { auth: { persistSession: false } });

function makeAddress(p: any) {
  const parts = [p.street, p.city, p.state, p.zip].filter(Boolean);
  return parts.length ? parts.join(", ") : (p.name || "");
}

(async () => {
  console.log("🗺️ Starting geocoding backfill...");
  
  // Get properties missing coordinates
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .or("lat.is.null,lng.is.null,lat.eq.0,lng.eq.0")
    .limit(1000);

  if (error) {
    console.error("❌ Error fetching properties:", error);
    process.exit(1);
  }

  if (!properties?.length) {
    console.log("✅ All properties already have coordinates!");
    process.exit(0);
  }

  console.log(`📍 Found ${properties.length} properties to geocode`);

  let ok = 0, fail = 0;
  
  for (const p of properties) {
    const address = makeAddress(p);
    console.log(`Processing ${p.id}: ${address}`);
    
    if (!address) {
      console.warn(`× ${p.id}: No address available`);
      fail++;
      continue;
    }
    
    const hit = await geocode(address);
    
    if (hit) {
      const { error: updateError } = await supabase
        .from("properties")
        .update({ lat: hit.lat, lng: hit.lng })
        .eq("id", p.id);
        
      if (updateError) {
        console.error(`× ${p.id}: Database update failed - ${updateError.message}`);
        fail++;
      } else {
        ok++;
        console.log(`✓ ${p.id}: ${address} -> ${hit.lat},${hit.lng} (${hit.provider})`);
      }
    } else {
      fail++;
      console.warn(`× ${p.id}: ${address} (no result)`);
    }
    
    await sleep(1000); // 1/sec rate limit
  }

  console.log(`\n🎉 Backfill complete: ${ok} updated, ${fail} skipped/failed`);
  process.exit(0);
})().catch(error => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
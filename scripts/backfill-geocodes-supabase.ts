import "dotenv/config";
import PQueue from "p-queue";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const PROVIDER = process.env.GEOCODER_PROVIDER || "google"; // "google" | "osm"
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

// Supabase setup (same as server/index.ts)
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
  console.error("❌ Missing Supabase REST URL and/or key. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(restUrl, key, { auth: { persistSession: false } });

// Geocoding functions (same as server/lib/geocode.ts but without database cache)
type GeocodeHit = { lat: number; lng: number; provider: string; confidence?: number };

async function geocode(address: string): Promise<GeocodeHit | null> {
  if (!address || !address.trim()) return null;

  let hit: GeocodeHit | null = null;
  if (PROVIDER === "google" && GOOGLE_KEY) {
    hit = await geocodeGoogle(address);
  } else {
    hit = await geocodeOSM(address);
  }

  return hit;
}

async function geocodeGoogle(address: string): Promise<GeocodeHit | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", GOOGLE_KEY!);

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const json = await res.json();
  const result = json?.results?.[0];
  if (!result) return null;

  const loc = result.geometry?.location;
  if (!loc) return null;
  return { lat: loc.lat, lng: loc.lng, provider: "google", confidence: result?.geometry?.location_type ? 1 : undefined };
}

async function geocodeOSM(address: string): Promise<GeocodeHit | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "0");
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Altus-Empire/1.0 (contact: admin@altus.example)" },
  });
  if (!res.ok) return null;
  const arr = await res.json();
  const first = arr?.[0];
  if (!first) return null;
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), provider: "osm", confidence: first.importance };
}

const queue = new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 });

async function backfillGeocode() {
  console.log("🗺️  Starting Supabase geocoding backfill...");

  // Get all properties from Supabase
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .or("lat.is.null,lng.is.null,lat.eq.0,lng.eq.0")
    .limit(1000);

  if (error) {
    console.error("❌ Error fetching properties:", error);
    process.exit(1);
  }

  if (!properties) {
    console.log("📍 No properties found needing geocoding");
    process.exit(0);
  }

  console.log(`Found ${properties.length} properties missing coordinates`);

  for (const [index, property] of properties.entries()) {
    const { id, name } = property;
    
    // Try property address fields - check multiple possible field names
    const addressToGeocode = property.property_address || 
                           property.address || 
                           property.street_address || 
                           property.full_address || 
                           name;
                           
    if (!addressToGeocode) {
      console.log(`⚠️  Skipping property ${id}: no address available`);
      continue;
    }

    queue.add(async () => {
      try {
        console.log(`[${index + 1}/${properties.length}] Geocoding property ${id}: "${addressToGeocode}"`);
        
        const result = await geocode(addressToGeocode);
        
        if (result) {
          const { error: updateError } = await supabase
            .from("properties")
            .update({ lat: result.lat, lng: result.lng })
            .eq("id", id);

          if (updateError) {
            console.error(`❌ Error updating property ${id}:`, updateError);
          } else {
            console.log(`✅ Property ${id} geocoded to: ${result.lat}, ${result.lng} (${result.provider})`);
          }
        } else {
          console.log(`❌ Failed to geocode property ${id}: "${addressToGeocode}"`);
        }
      } catch (error) {
        console.error(`💥 Error geocoding property ${id}:`, error);
      }
    });
  }

  await queue.onIdle();
  console.log("🎉 Geocoding backfill complete!");
  
  // Final count
  const { data: updated, error: countError } = await supabase
    .from("properties")
    .select("id")
    .not("lat", "is", null)
    .not("lng", "is", null)
    .neq("lat", 0)
    .neq("lng", 0);
  
  if (countError) {
    console.error("Error counting updated properties:", countError);
  } else {
    console.log(`📍 Total properties with coordinates: ${updated?.length || 0}`);
  }
  
  process.exit(0);
}

backfillGeocode().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
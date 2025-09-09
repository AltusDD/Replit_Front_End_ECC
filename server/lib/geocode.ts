/**
 * Lightweight geocoding helper with Google (preferred) or OSM fallback.
 * Uses: GEOCODER_PROVIDER=google|osm, GOOGLE_MAPS_API_KEY
 */
type GeoResult = { lat: number; lng: number } | null;

const sleep = (ms:number)=> new Promise(r=>setTimeout(r, ms));

async function geocodeGoogle(address: string): Promise<GeoResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
  if (!apiKey) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const j = await res.json();
  const loc = j?.results?.[0]?.geometry?.location;
  if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return null;
  return { lat: loc.lat, lng: loc.lng };
}

async function geocodeOSM(address: string): Promise<GeoResult> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  const res = await fetch(url.toString(), { headers: { "User-Agent": "ECC/1.0" }});
  if (!res.ok) return null;
  const j = await res.json();
  const row = j?.[0];
  if (!row || !row.lat || !row.lon) return null;
  return { lat: Number(row.lat), lng: Number(row.lon) };
}

export async function geocodeAddress(address: string): Promise<GeoResult> {
  const provider = (process.env.GEOCODER_PROVIDER || "google").toLowerCase();
  if (provider === "google") {
    const g = await geocodeGoogle(address);
    if (g) return g;
    return geocodeOSM(address);
  } else {
    const o = await geocodeOSM(address);
    if (o) return o;
    return geocodeGoogle(address);
  }
}

export async function backfillPropertyCoords(
  { limit=50, delayMs=1100, admin, fromOwnerId }:
  { limit?: number; delayMs?: number; admin: any; fromOwnerId?: number }
) {
  // fetch properties missing lat/lng (optionally only a specific owner)
  let q = admin.from("properties")
    .select("id,name,address1,city,state,zip,lat,lng")
    .is("lat", null)
    .is("lng", null)
    .limit(limit);

  if (fromOwnerId) q = q.eq("owner_id", fromOwnerId);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  let updated = 0;
  for (const p of (data || [])) {
    const parts = [p.address1, p.city, p.state, p.zip].filter(Boolean);
    if (!parts.length) continue;
    const addr = parts.join(", ");
    const geo = await geocodeAddress(addr);
    if (geo) {
      const { error: uerr } = await admin.from("properties")
        .update({ lat: geo.lat, lng: geo.lng })
        .eq("id", p.id);
      if (!uerr) updated++;
    }
    await sleep(delayMs); // be polite to APIs
  }
  return { checked: (data||[]).length, updated };
}

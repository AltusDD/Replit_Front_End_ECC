import fetch from "node-fetch";

const PROVIDER = process.env.GEOCODER_PROVIDER || "google"; // "google" | "osm"
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

type GeocodeHit = { lat: number; lng: number; provider: string; confidence?: number };

export async function geocode(address: string): Promise<GeocodeHit | null> {
  if (!address || !address.trim()) return null;

  // 1) cache hit?
  const cached = await getCache(address);
  if (cached) return cached;

  // 2) provider
  let hit: GeocodeHit | null = null;
  if (PROVIDER === "google" && GOOGLE_KEY) {
    hit = await geocodeGoogle(address);
  } else {
    hit = await geocodeOSM(address); // OpenStreetMap Nominatim
  }

  if (hit) await putCache(address, hit);
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

// --- simplified caching (no database for now) ---
const memoryCache = new Map<string, GeocodeHit>();

async function getCache(address: string): Promise<GeocodeHit | null> {
  return memoryCache.get(address) || null;
}

async function putCache(address: string, hit: GeocodeHit): Promise<void> {
  memoryCache.set(address, hit);
}
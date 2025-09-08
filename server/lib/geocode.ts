// server/lib/geocode.ts
// Uses Node18+ global fetch. No extra deps.

import { pool } from "../db"; // your existing pg Pool

const PROVIDER = (process.env.GEOCODER_PROVIDER || "google").toLowerCase();
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

type Hit = { lat: number; lng: number; provider: string; confidence?: number | null };

export async function geocode(address: string): Promise<Hit | null> {
  if (!address?.trim()) return null;

  // 1) cache
  const c = await cacheGet(address);
  if (c) return c;

  // 2) provider
  const hit = PROVIDER === "google" && GOOGLE_KEY
    ? await geocodeGoogle(address)
    : await geocodeOSM(address);

  if (hit) await cachePut(address, hit);
  return hit;
}

async function geocodeGoogle(address: string): Promise<Hit | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", GOOGLE_KEY!);
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const g = j?.results?.[0]?.geometry?.location;
  if (!g) return null;
  return { lat: g.lat, lng: g.lng, provider: "google", confidence: 1 };
}

async function geocodeOSM(address: string): Promise<Hit | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "jsonv2");
  const r = await fetch(url, {
    headers: { "User-Agent": "Altus-Empire/1.0 (contact: admin@altus.example)" },
  });
  if (!r.ok) return null;
  const a = await r.json();
  const f = a?.[0];
  if (!f) return null;
  return { lat: parseFloat(f.lat), lng: parseFloat(f.lon), provider: "osm", confidence: f.importance ?? null };
}

// cache
async function cacheGet(address: string): Promise<Hit | null> {
  const { rows } = await pool.query(
    "SELECT lat,lng,provider,confidence FROM geocode_cache WHERE address=$1",
    [address]
  );
  const r = rows[0];
  return r ? { lat: r.lat, lng: r.lng, provider: r.provider, confidence: r.confidence } : null;
}

async function cachePut(address: string, hit: Hit) {
  await pool.query(
    `INSERT INTO geocode_cache(address,lat,lng,provider,confidence)
     VALUES($1,$2,$3,$4,$5)
     ON CONFLICT(address)
     DO UPDATE SET lat=EXCLUDED.lat,lng=EXCLUDED.lng,provider=EXCLUDED.provider,confidence=EXCLUDED.confidence,updated_at=now()`,
    [address, hit.lat, hit.lng, hit.provider, hit.confidence ?? null]
  );
}
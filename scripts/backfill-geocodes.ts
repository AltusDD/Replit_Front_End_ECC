// Genesis Backfill: Populate properties.lat/lng from full addresses via Google (or OSM fallback)
// Usage: set secrets in Replit, then run `npx tsx scripts/backfill-geocodes.ts`
import 'dotenv/config';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // requires write access
const supabase = createClient(supabaseUrl, supabaseKey);

const PROVIDER = (process.env.GEOCODER_PROVIDER || 'google').toLowerCase();
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
const RATE = Number(process.env.GEOCODER_RATE_PER_SEC || 2); // req/sec
const SLEEP_MS = Math.ceil(1000 / Math.max(1, RATE));

function hash(s: string) { return crypto.createHash('sha1').update(s).digest('hex'); }
async function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function geocode(address: string): Promise<{lat:number,lng:number} | null> {
  if (!address) return null;

  if (PROVIDER === 'google') {
    if (!GOOGLE_KEY) throw new Error('Missing GOOGLE_MAPS_API_KEY');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`;
    const r = await fetch(url);
    const j: any = await r.json();
    if (j.status !== 'OK' || !j.results?.[0]) return null;
    const loc = j.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  }

  // Fallback: OpenStreetMap Nominatim
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Altus-ECC/1.0 (contact: ops@altus)' } });
  const j: any[] = await r.json();
  if (!j?.[0]) return null;
  return { lat: Number(j[0].lat), lng: Number(j[0].lon) };
}

async function upsertCache(addr: string, lat: number | null, lng: number | null, status: string, raw: any = null) {
  try {
    const addr_hash = hash(addr);
    await supabase.from('geocode_cache').upsert({ addr_hash, full_address: addr, lat, lng, status, raw });
  } catch { /* cache table may not exist; ignore */ }
}

const BATCH = 500;

async function fetchAddresses(offset = 0) {
  // Prefer a helper view if present
  const view = await supabase.from('v_property_full_address').select('id, full_address').range(offset, offset + BATCH - 1);
  if (!view.error && view.data && view.data.length) {
    return { rows: view.data as {id:number, full_address:string}[], more: view.data.length === BATCH };
  }

  // Fallback: try to synthesize addresses from common columns
  const base = await supabase.from('properties')
    .select('id, name, street, address, address1, address_line1, line1, city, state, zip')
    .range(offset, offset + BATCH - 1);
  if (base.error || !base.data) return { rows: [], more: false };
  const rows = (base.data as any[]).map(r => {
    const street = r.street || r.address || r.address1 || r.address_line1 || r.line1 || '';
    const city = r.city || '';
    const state = r.state || '';
    const zip = r.zip || '';
    const full = [street, city, state, zip].filter(Boolean).join(', ').replace(/\s+,/g, ',').trim();
    return { id: r.id as number, full_address: full };
  }).filter(x => x.full_address);
  return { rows, more: base.data.length === BATCH };
}

async function main() {
  let offset = 0;
  let totalWritten = 0;

  console.log('Provider:', PROVIDER, 'Rate:', RATE, 'req/sec');

  while (true) {
    const { rows, more } = await fetchAddresses(offset);
    if (!rows.length) break;
    offset += rows.length;

    const ids = rows.map(r => r.id);
    const { data: props } = await supabase.from('properties').select('id, lat, lng').in('id', ids);
    const byId = new Map((props || []).map(p => [p.id, p]));
    const todo = rows.filter(r => {
      const p = byId.get(r.id);
      return !p || p.lat == null || p.lng == null;
    });

    for (const row of todo) {
      const addr = row.full_address;
      try {
        // cache check
        const { data: hit } = await supabase.from('geocode_cache').select('lat,lng,status').eq('addr_hash', hash(addr)).maybeSingle();
        if (hit && hit.lat != null && hit.lng != null) {
          await supabase.from('properties').update({ lat: hit.lat, lng: hit.lng }).eq('id', row.id);
          totalWritten++; continue;
        }

        const res = await geocode(addr);
        await sleep(SLEEP_MS);

        if (!res) { await upsertCache(addr, null, null, 'no_result', null); console.log('No result:', row.id, addr); continue; }

        await upsertCache(addr, res.lat, res.lng, 'ok', null);
        await supabase.from('properties').update({ lat: res.lat, lng: res.lng }).eq('id', row.id);
        totalWritten++;
        console.log('OK:', row.id, addr, res.lat, res.lng);
      } catch (e: any) {
        console.error('Error:', row.id, addr, e?.message || e);
        await upsertCache(addr, null, null, 'error', { message: String(e) });
      }
    }

    if (!more) break;
  }

  console.log('Backfill complete. Updated rows:', totalWritten);
}

main().catch(e => { console.error(e); process.exit(1); });
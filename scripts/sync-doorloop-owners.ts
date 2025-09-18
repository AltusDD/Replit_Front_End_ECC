/* Incremental owners sync from DoorLoop -> Supabase
   ENV needed:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - DOORLOOP_API_KEY
   Optional:
   - DOORLOOP_BASE_URL (default: https://api.doorloop.com/v1)
   - OWNERS_ENDPOINT    (default: /owners)
   - SINCE_DAYS         (default: 30 — incremental window)
   - NODE_FETCH_POLYFILL (set to "1" to polyfill fetch with undici if on Node<18)
*/

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Polyfill fetch for Node <18 if requested
if (!globalThis.fetch && process.env.NODE_FETCH_POLYFILL === '1') {
  // @ts-ignore
  const { fetch, Headers, Request, Response } = await import('undici');
  // @ts-ignore
  globalThis.fetch = fetch;
  // @ts-ignore
  globalThis.Headers = Headers;
  // @ts-ignore
  globalThis.Request = Request;
  // @ts-ignore
  globalThis.Response = Response;
}

const SUPABASE_URL  = process.env.SUPABASE_URL!;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DL_TOKEN      = process.env.DOORLOOP_API_KEY!;
const BASE_URL      = process.env.DOORLOOP_BASE_URL || 'https://api.doorloop.com/v1';
const OWNERS_PATH   = process.env.OWNERS_ENDPOINT   || '/owners';
const SINCE_DAYS    = Number(process.env.SINCE_DAYS || 30);

if (!SUPABASE_URL || !SUPABASE_KEY || !DL_TOKEN) {
  console.error('Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DOORLOOP_API_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession:false } });

type DlOwner = {
  id: number;
  companyName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  updatedAt?: string | null; // ISO
};

function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

async function getCheckpoint(): Promise<string | null> {
  const { data, error } = await sb.from('integration_state')
    .select('value')
    .eq('key','doorloop_owners')
    .maybeSingle();
  if (error) {
    console.warn('[checkpoint] read warning:', error.message);
  }
  return (data as any)?.value?.last_cursor ?? null;
}

async function setCheckpoint(cursor:string) {
  const { error } = await sb.from('integration_state').upsert({
    key: 'doorloop_owners',
    value: { last_cursor: cursor }
  });
  if (error) console.warn('[checkpoint] write warning:', error.message);
}

function toDisplay(company?:string|null, first?:string|null, last?:string|null){
  const c = (company||'').trim();
  if (c) return c;
  const p = [first,last].filter(Boolean).join(' ').trim();
  return p || null;
}

/**
 * DoorLoop paging:
 *  - Header: Authorization: bearer <API_KEY>  (per DL docs)  ← important
 *  - Query: page_number (1-based), page_size
 *  - Response: { total: number, data: DlOwner[] }
 * Some endpoints lack updated filters. We sort (if supported) and filter in code by sinceIso.
 */
async function fetchOwnersIncremental(sinceIso: string) {
  const results: DlOwner[] = [];
  let page = 1;
  const pageSize = 200;

  while (true) {
    const url = new URL(BASE_URL + OWNERS_PATH);
    url.searchParams.set('page_number', String(page));
    url.searchParams.set('page_size', String(pageSize));
    // best-effort sorting hints (harmless if ignored)
    url.searchParams.set('sort_by', 'updatedAt');
    url.searchParams.set('sort_descending', 'true');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `bearer ${DL_TOKEN}` } // DL docs show 'bearer' example
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`DoorLoop owners fetch failed: ${res.status} ${body}`);
    }
    const json: any = await res.json();
    const batch: DlOwner[] = Array.isArray(json) ? json : (json.data || []);
    if (!Array.isArray(batch)) {
      throw new Error('DoorLoop owners response not an array at data');
    }

    // client-side incremental filter (robust across endpoints)
    const filtered = sinceIso
      ? batch.filter(o => !o.updatedAt || o.updatedAt >= sinceIso)
      : batch;

    results.push(...filtered);

    const total = (json && typeof json.total === 'number') ? json.total : undefined;
    const hasMore = total !== undefined
      ? page * pageSize < total
      : batch.length === pageSize; // fallback heuristic

    if (!hasMore) break;
    page += 1;
    await sleep(250); // polite rate limiting
  }
  return results;
}

async function upsertOwners(owners: DlOwner[]) {
  if (!owners.length) return;

  const rows = owners.map(o => ({
    doorloop_owner_id: o.id,
    company_name: o.companyName ?? null,
    first_name:   o.firstName ?? null,
    last_name:    o.lastName  ?? null,
    display_name: toDisplay(o.companyName, o.firstName, o.lastName),
    updated_at:   o.updatedAt ? new Date(o.updatedAt).toISOString() : null,
  }));

  const { error } = await sb
    .from('owners')
    .upsert(rows, { onConflict: 'doorloop_owner_id' });
  if (error) throw error;

  // Optional server-side display_name backfill (no-op if not present)
  await sb.rpc('sql', { q: `
    update public.owners
    set display_name = coalesce(
      nullif(trim(company_name), ''),
      nullif(trim(concat_ws(' ', first_name, last_name)), '')
    )
    where (display_name is null or display_name = '');
  ` } as any).catch(()=>{});
}

(async () => {
  const now = new Date();
  const since = new Date(now.getTime() - SINCE_DAYS*24*60*60*1000);
  const fallbackSinceIso = since.toISOString();
  const lastCursor = await getCheckpoint();
  const effectiveSince = lastCursor || fallbackSinceIso;

  console.log('Syncing owners updated after (client filter):', effectiveSince);

  const owners = await fetchOwnersIncremental(effectiveSince);
  console.log(`Fetched ${owners.length} owners from DoorLoop (post-filter)`);

  await upsertOwners(owners);

  await setCheckpoint(new Date().toISOString());
  console.log('Owner sync complete.');
})().catch(err => {
  console.error('[fatal]', err?.stack || err);
  process.exit(1);
});

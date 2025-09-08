/* Incremental owners sync from DoorLoop -> Supabase
   ENV needed:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - DOORLOOP_API_KEY
   Optional:
   - DOORLOOP_BASE_URL (default: https://api.doorloop.com/v1)
   - OWNERS_ENDPOINT    (default: /owners)
   - SINCE_DAYS         (default: 30 — incremental window)
*/

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

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
  updatedAt?: string | null;
};

function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

async function getCheckpoint(): Promise<string | null> {
  const { data } = await sb.from('integration_state').select('value').eq('key','doorloop_owners').single();
  return data?.value?.last_cursor ?? null;
}

async function setCheckpoint(cursor:string) {
  await sb.from('integration_state').upsert({
    key: 'doorloop_owners',
    value: { last_cursor: cursor }
  });
}

function toDisplay(company?:string|null, first?:string|null, last?:string|null){
  const c = (company||'').trim();
  if (c) return c;
  const p = [first,last].filter(Boolean).join(' ').trim();
  return p || null;
}

async function fetchOwnersIncremental(sinceIso: string) {
  const results: DlOwner[] = [];
  let page = 1;
  while (true) {
    const url = new URL(BASE_URL + OWNERS_PATH);
    // Adjust these params if your DL API uses different pagination
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', '200');
    url.searchParams.set('updated_after', sinceIso); // many APIs accept this; harmless if ignored

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${DL_TOKEN}` }
    });
    if (!res.ok) throw new Error(`DoorLoop owners fetch failed: ${res.status} ${await res.text()}`);
    const json = await res.json() as any;

    // Accept common shapes: {data:[], meta:{}} or straight []
    const batch: DlOwner[] = Array.isArray(json) ? json : (json.data || []);
    results.push(...batch);

    const hasMore = Array.isArray(json) ? batch.length === 200
                 : json?.meta?.nextPage ?? (batch.length === 200);
    if (!hasMore) break;

    page += 1;
    await sleep(250); // polite rate limiting
  }
  return results;
}

async function upsertOwners(owners: DlOwner[]) {
  if (owners.length === 0) return;

  const rows = owners.map(o => ({
    doorloop_owner_id: o.id,
    company_name: o.companyName ?? null,
    first_name:   o.firstName ?? null,
    last_name:    o.lastName  ?? null,
    display_name: toDisplay(o.companyName, o.firstName, o.lastName),
  }));

  // Upsert by doorloop_owner_id
  const { error } = await sb.from('owners')
    .upsert(rows, { onConflict: 'doorloop_owner_id' })
    .select();
  if (error) throw error;

  // Make sure display_name is never blank
  await sb.rpc('sql', { q: `
    update public.owners
    set display_name = coalesce(
      nullif(trim(company_name), ''),
      nullif(trim(concat_ws(' ', first_name, last_name)), '')
    )
    where (display_name is null or display_name = '');
  ` } as any).catch(()=>{ /* ignore if rpc(sql) not present */});
}

(async () => {
  const now = new Date();
  const since = new Date(now.getTime() - SINCE_DAYS*24*60*60*1000);
  const fallbackSinceIso = since.toISOString();
  const lastCursor = await getCheckpoint();
  const effectiveSince = lastCursor || fallbackSinceIso;

  console.log('Syncing owners updated after:', effectiveSince);

  const owners = await fetchOwnersIncremental(effectiveSince);
  console.log(`Fetched ${owners.length} owners from DoorLoop`);

  await upsertOwners(owners);

  await setCheckpoint(new Date().toISOString());
  console.log('Owner sync complete.');
})();
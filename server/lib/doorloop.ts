// server/lib/doorloop.ts
const DL_TOKEN = process.env.DOORLOOP_API_KEY!;
const DL_BASE  = process.env.DOORLOOP_BASE_URL || 'https://api.doorloop.com/v1';

if (!DL_TOKEN) {
  throw new Error('Missing DOORLOOP_API_KEY');
}

export async function dlFetch(path: string, query: Record<string,string|number|undefined> = {}) {
  const url = new URL(DL_BASE + path);
  Object.entries(query).forEach(([k,v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${DL_TOKEN}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DoorLoop ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function dlPaginate<T>(
  path: string,
  params: Record<string,string|number|undefined> = {},
  pageSize = 200
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  while (true) {
    const data = await dlFetch(path, { ...params, page, limit: pageSize });
    const batch: T[] = Array.isArray(data) ? data : (data.data || []);
    out.push(...batch);
    const hasMore = Array.isArray(data) ? batch.length === pageSize
                 : (data?.meta?.nextPage ?? (batch.length === pageSize));
    if (!hasMore) break;
    page += 1;
    await new Promise(r => setTimeout(r, 250)); // polite
  }
  return out;
}
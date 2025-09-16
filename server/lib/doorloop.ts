// server/lib/doorloop.ts
import { dlGet } from '../clients/doorloop';

const API_KEY = process.env.DOORLOOP_API_KEY || "";

// DoorLoop integration is optional - gracefully handle missing API key
const DOORLOOP_ENABLED = Boolean(API_KEY);

export async function dlFetch(path: string, query: Record<string,string|number|undefined> = {}) {
  if (!DOORLOOP_ENABLED) {
    throw new Error('DoorLoop API key not configured. Please set DOORLOOP_API_KEY environment variable.');
  }

  return dlGet(path, query);
}

export async function dlPaginate<T>(
  path: string,
  params: Record<string,string|number|undefined> = {},
  pageSize = 200
): Promise<T[]> {
  if (!DOORLOOP_ENABLED) {
    throw new Error('DoorLoop API key not configured. Please set DOORLOOP_API_KEY environment variable.');
  }

  const out: T[] = [];
  let page = 1;
  while (true) {
    const data = await dlFetch(path, { ...params, page_number: page, page_size: pageSize });
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

export { DOORLOOP_ENABLED };
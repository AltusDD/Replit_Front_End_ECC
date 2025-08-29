import { useEffect, useMemo, useState } from 'react';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const COLL_BASE = import.meta.env.VITE_API_COLLECTION_BASE || ''; // optional override
const KEY = import.meta.env.VITE_API_KEY || '';

const HEADERS: Record<string, string> = { Accept: 'application/json' };
if (KEY) HEADERS['x-api-key'] = KEY;

/** Build a request URL that plays nice with the Vite proxy.
 * - absolute URLs pass through as-is
 * - paths beginning with "/" are returned unchanged (so proxy can catch them)
 * - bare paths are joined to API_BASE
 * - optional query params appended
 */
export function buildUrl(path: string, params?: Record<string, any>): string {
  let out = path;

  if (!/^https?:\/\//i.test(path)) {
    if (!path.startsWith('/')) out = `${API_BASE.replace(/\/$/,'')}/${path}`;
  }

  if (params && Object.keys(params).length) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v != null) sp.set(k, String(v));
    const q = sp.toString();
    if (q) out += (out.includes('?') ? '&' : '?') + q;
  }
  return out;
}

export async function fetchJSON<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/** Fetch a portfolio collection using several likely paths (first that works wins). */
export async function fetchCollection(col: string, qs: string) {
  const paths = [
    COLL_BASE ? `${COLL_BASE.replace(/\/$/,'')}/${col}${qs}` : '',
    `${API_BASE.replace(/\/$/,'')}/portfolio/${col}${qs}`,
    `${API_BASE.replace(/\/$/,'')}/${col}${qs}`,
  ].filter(Boolean);

  const errors: Array<[string, unknown]> = [];
  for (const u of paths) {
    try { return await fetchJSON<any>(u); } catch (e) { errors.push([u, e]); }
  }
  const err = new Error(`No collection endpoint worked for "${col}". Tried: ${paths.join(', ')}`);
  (err as any).attempts = errors;
  throw err;
}

/** Counts for the dashboard (tries /counts then /portfolio/counts). */
export function useCounts() {
  const [data, set] = useState<any | null>(null);
  const [loading, setL] = useState(true);
  const [error, setE] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setL(true); setE(null);
      const candidates = [
        `${API_BASE.replace(/\/$/,'')}/counts`,
        `${API_BASE.replace(/\/$/,'')}/portfolio/counts`,
      ];
      let ok: any = null;
      for (const u of candidates) { try { ok = await fetchJSON(u); break; } catch {} }
      if (!ok) setE(new Error('Counts endpoint not found')); else set(ok);
      setL(false);
    })();
  }, []);
  return { data, loading, error };
}

/** Generic collection hook with stable shape handling. */
export function useCollection(col: string, params: Record<string, any> = {}) {
  const qs = useMemo(() => {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && s.set(k, String(v)));
    const q = s.toString();
    return q ? `?${q}` : '';
  }, [JSON.stringify(params)]);

  const [data, set] = useState<any[]>([]);
  const [loading, setL] = useState(true);
  const [error, setE] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setL(true); setE(null);
      try {
        const json = await fetchCollection(col, qs);
        if (!alive) return;
        const rows =
          Array.isArray(json?.items) ? json.items :
          Array.isArray(json) ? json :
          Array.isArray(json?.data) ? json.data :
          [];
        set(rows);
      } catch (e) {
        if (!alive) return;
        setE(e); set([]);
      } finally { if (alive) setL(false); }
    })();
    return () => { alive = false };
  }, [col, qs]);

  return { data, loading, error };
}

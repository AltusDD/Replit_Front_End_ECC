import { useEffect, useMemo, useState } from 'react';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const KEY = import.meta.env.VITE_API_KEY || '';
const HEADERS: Record<string, string> = { Accept: 'application/json' };
if (KEY) HEADERS['x-api-key'] = KEY;

export function buildUrl(path: string, params?: Record<string, any>): string {
  let out = path;
  if (!/^https?:\/\//i.test(path)) {
    if (!path.startsWith('/')) out = `${API_BASE.replace(/\/$/, '')}/${path}`;
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

async function tryCountsDirect(): Promise<Record<string, number> | null> {
  const cands = [
    `${API_BASE.replace(/\/$/, '')}/portfolio/counts`,
    `${API_BASE.replace(/\/$/, '')}/counts`,
    `${API_BASE.replace(/\/$/, '')}/rpc/portfolio_counts`,
  ];
  for (const u of cands) {
    try {
      const j: any = await fetchJSON(u);
      if (j && typeof j === 'object') return j;
    } catch {}
  }
  return null;
}

async function countForCollection(col: string): Promise<number> {
  // count endpoints
  const endpoints = [
    `${API_BASE.replace(/\/$/, '')}/portfolio/${col}/count`,
    `${API_BASE.replace(/\/$/, '')}/${col}/count`,
    `${API_BASE.replace(/\/$/, '')}/rpc/${col}_count`,
  ];
  for (const u of endpoints) {
    try {
      const j: any = await fetchJSON(u);
      const n = j?.count ?? j?.total ?? (Array.isArray(j) ? j[0]?.count : undefined);
      if (typeof n === 'number' && !Number.isNaN(n)) return n;
    } catch {}
  }

  // HEAD/GET with X-Total-Count then meta.total
  try {
    const head = await fetch(buildUrl(`portfolio/${col}?limit=1`), {
      method: 'GET',
      headers: HEADERS,
    });
    const hdr =
      head.headers.get('X-Total-Count') ||
      head.headers.get('x-total-count') ||
      head.headers.get('total-count');
    if (hdr) return Number(hdr);
    const j: any = await head.json().catch(() => null);
    const n =
      j?.total ??
      j?.meta?.total ??
      (Array.isArray(j?.items) ? j.items.length : Array.isArray(j) ? j.length : 0);
    if (typeof n === 'number') return n;
  } catch {}

  return 0;
}

export function useCounts() {
  const [data, set] = useState<Record<string, number> | null>(null);
  const [loading, setL] = useState(true);
  const [error, setE] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setL(true);
      setE(null);
      const direct = await tryCountsDirect();
      if (direct) {
        set(direct);
        setL(false);
        return;
      }

      // Compute as fallback
      const cols = ['properties', 'units', 'leases', 'tenants', 'owners'];
      const entries = await Promise.all(
        cols.map(async (col) => [col, await countForCollection(col)] as const),
      );
      set(Object.fromEntries(entries));
      setL(false);
    })().catch((e) => {
      setE(e);
      setL(false);
    });
  }, []);

  return { data, loading, error };
}

export async function fetchCollection(
  col: string,
  params: Record<string, any> = {},
): Promise<any[]> {
  const qs =
    Object.keys(params).length > 0
      ? '?' +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : '';

  const candidates = [buildUrl(`portfolio/${col}${qs}`), buildUrl(`${col}${qs}`)];

  let json: any = null;
  for (const url of candidates) {
    try {
      json = await fetchJSON(url);
      break;
    } catch {
      // Try next candidate
    }
  }

  const rows = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
  return rows;
}

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
      setL(true);
      setE(null);
      const candidates = [buildUrl(`portfolio/${col}${qs}`), buildUrl(`${col}${qs}`)];
      let json: any = null;
      for (const u of candidates) {
        try {
          json = await fetchJSON(u);
          break;
        } catch {}
      }
      if (!alive) return;

      const rows = Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];
      set(rows);
      setL(false);
    })().catch((e) => {
      if (alive) {
        setE(e);
        setL(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [col, qs]);

  return { data, loading, error };
}

const ABS = /^https?:\/\//i;
export function getBase() {
  const raw = (import.meta as any).env?.VITE_API_BASE ?? '/api';
  const base = String(raw).trim();
  if (ABS.test(base)) return base.replace(/\/+$/, '');
  const origin = (typeof window !== 'undefined' && window.location?.origin) || '';
  return `${origin}/${base.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}
export function normalizePath(s: string) {
  const t = String(s)
    .replace(/^\/+api\/+/, '')
    .replace(/^\/+/, '');
  return t.includes('/') ? t : `portfolio/${t}`;
}
export function buildUrl(path: string, params?: Record<string, any>) {
  const u = new URL(normalizePath(path), getBase() + '/');
  if (params)
    for (const [k, v] of Object.entries(params))
      if (v != null && v !== '') u.searchParams.set(k, String(v));
  return u.toString();
}
export async function fetchJSON(
  path: string,
  opts: {
    params?: Record<string, any>;
    signal?: AbortSignal;
    headers?: Record<string, string>;
  } = {},
) {
  const url = buildUrl(path, opts.params);
  const res = await fetch(url, {
    signal: opts.signal,
    headers: { Accept: 'application/json', ...(opts.headers || {}) },
  });
  if (!res.ok) {
    const isRpc = /^rpc\//i.test(normalizePath(path));
    if (isRpc && res.status === 404) return [];
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}
export async function fetchCollection(
  coll: string,
  params: {
    select?: string;
    order?: string;
    limit?: number;
    offset?: number;
    signal?: AbortSignal;
  } = {},
) {
  const p = { select: '*', limit: 200, ...(params || {}) };
  const items = await fetchJSON(coll, { params: p, signal: params.signal });
  return { items: Array.isArray(items) ? items : [] };
}

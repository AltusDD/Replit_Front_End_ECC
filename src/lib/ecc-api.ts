const ABS = /^https?:\/\//i;

export function getBase(): string {
  const raw = (import.meta as any).env?.VITE_API_BASE ?? '/api';
  const base = (String(raw || '/api')).trim();
  if (ABS.test(base)) return base.replace(/\/+$/, '');
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost';
  return `${origin}/${base.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

export function normalizePath(input: string): string {
  const s = String(input).replace(/^\/+api\/+/, '').replace(/^\/+/, '');
  return s.includes('/') ? s : `portfolio/${s}`;
}

export function buildUrl(
  input: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  const url = new URL(normalizePath(input), getBase() + '/');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function fetchJSON(
  path: string,
  opts: { params?: Record<string, any>; signal?: AbortSignal; headers?: Record<string, string> } = {}
) {
  const url = buildUrl(path, opts.params);
  const res = await fetch(url, {
    signal: opts.signal,
    headers: { Accept: 'application/json', ...(opts.headers || {}) }
  });
  if (!res.ok) {
    const isRpc = /^rpc\//i.test(normalizePath(path));
    if (isRpc && res.status === 404) return []; // optional feature absent
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

export async function fetchCollection(
  collOrPath: string,
  params: { select?: string; order?: string; limit?: number; offset?: number; signal?: AbortSignal } = {}
) {
  const p = { select: '*', limit: 200, ...(params || {}) };
  const items = await fetchJSON(collOrPath, { params: p, signal: params.signal });
  return { items: Array.isArray(items) ? items : [] };
}

// src/lib/ecc-api.ts
const BASE = "";

export type Query = Record<string, string | number | boolean | null | undefined>;

function q(params?: Query) {
  if (!params) return "";
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    s.append(k, String(v));
  }
  const str = s.toString();
  return str ? `?${str}` : "";
}

export async function apiGet<T = unknown>(path: string, params?: Query) {
  const res = await fetch(`${BASE}${path}${q(params)}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}

export async function apiPost<T = unknown>(path: string, body?: any) {
  const baseUrl = path.startsWith('/bff/') ? '' : BASE; // BFF calls are relative, others use Azure Functions
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

// Convenience wrappers for entities
export const Entities = {
  owners:   (params?: Query) => apiGet<any[]>("/api/entities/owners",   params),
  tenants:  (params?: Query) => apiGet<any[]>("/api/entities/tenants",  params),
  leases:   (params?: Query) => apiGet<any[]>("/api/entities/leases",   params),
  units:    (params?: Query) => apiGet<any[]>("/api/entities/units",    params),
  properties:(params?: Query)=> apiGet<any[]>("/api/entities/properties",params),
};

// Owners extras
export const Owners = {
  search: (qstr: string) => apiGet<any>("/api/owners/search", { q: qstr }),
  transferContext: (sourceOwnerId: string|number) =>
    apiGet<any>("/api/owners/transfercontext", { sourceOwnerId }),
  initiateTransfer: () => apiPost<{ transferId: string }>("/api/owners/initiatetransfer", { note: "from UI" }),
  approve:   (transferId: string) => apiPost("/bff/owners/approvetransfer",   { transferId }),
  authorize: (transferId: string) => apiPost("/bff/owners/authorizetransfer", { transferId }),
  execute:   (transferId: string) => apiPost("/bff/owners/executetransfer",   { transferId }),
};

// Legacy exports for backward compatibility
export const API_BASE = BASE;

// Legacy functions for backward compatibility
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
    adminToken?: string;
  } = {},
) {
  const url = buildUrl(path, opts.params);
  const headers: Record<string, string> = { 
    Accept: 'application/json', 
    ...(opts.headers || {}) 
  };
  
  // Add admin token for Azure Functions authentication
  if (opts.adminToken) {
    headers['x-admin-token'] = opts.adminToken;
  }
  
  const res = await fetch(url, {
    signal: opts.signal,
    headers,
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

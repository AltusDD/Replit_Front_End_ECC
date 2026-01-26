export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, { headers: { "Accept":"application/json" }, ...init });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Safe fetch with default */
export async function tryJSON<T>(path: string, fallback: T): Promise<T> {
  try { return await getJSON<T>(path); } catch { return fallback; }
}

/** Collections */
export type Property = { id: string|number; name?: string; address1?: string; city?: string; state?: string; zip?: string; status?: string; };
export type Unit = { id: string|number; name?: string; bedrooms?: number; bathrooms?: number; sqft?: number; marketRent?: number; status?: string; propertyId?: string|number };
export type Lease = { id: string|number; unitId?: string|number; tenantName?: string; startDate?: string; endDate?: string; status?: string; };
export type Tenant = { id: string|number; name?: string; email?: string; phone?: string; status?: string; };
export type Owner = { id: string|number; name?: string; email?: string; phone?: string; holdings?: number; };

export const PortfolioAPI = {
  properties: () => getJSON<Property[]>("/portfolio/properties"),
  units:       () => getJSON<Unit[]>("/portfolio/units"),
  leases:      () => getJSON<Lease[]>("/portfolio/leases"),
  tenants:     () => getJSON<Tenant[]>("/portfolio/tenants"),
  owners:      () => getJSON<Owner[]>("/portfolio/owners"),
};

export type BadgeCounts = { workOrdersOpen?: number; collectionsOpen?: number; inventoryLow?: number; };

export async function fetchBadgeCounts(): Promise<BadgeCounts> {
  // Try specific endpoints; fall back to zeros if any are missing
  const [wo, col, inv] = await Promise.all([
    tryJSON<number>("/ops/work/work-orders/count", 0),
    tryJSON<number>("/ops/accounting/collections/open-count", 0),
    tryJSON<number>("/ops/work/inventory/low-count", 0),
  ]);
  return { workOrdersOpen: wo ?? 0, collectionsOpen: col ?? 0, inventoryLow: inv ?? 0 };
}

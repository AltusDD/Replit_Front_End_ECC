import { api } from "../../../lib/api";

const BASE = import.meta.env.VITE_API_BASE_URL || "";
// ADMIN_TOKEN removed for security - server handles authentication

export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateOwnerData {
  name: string;
  email?: string;
  phone?: string;
}

async function req(path: string, body?: any, method: "POST"|"GET" = "POST") {
  const url = `${BASE}/api/owner-transfer${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      // x-admin-token removed - server handles authentication
    },
    body: method === "POST" ? JSON.stringify(body || {}) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}

/**
 * Search for owners by name
 */
export async function searchOwners(query: string): Promise<Owner[]> {
  const response = await api(`/api/owners/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });
  
  return response as Owner[];
}

/**
 * Create a new owner
 */
export async function createOwner(data: CreateOwnerData): Promise<Owner> {
  const response = await api("/api/owners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  return response as Owner;
}

export const OwnerTransferAPI = {
  initiate: (payload: {
    sourceOwnerId: string;
    targetOwnerId: string;
    effectiveDate: string; // ISO
    include: {
      properties: boolean; units: boolean; leases: boolean; tenants: boolean; files: boolean; workOrders: boolean; comms: boolean; financials: boolean;
    };
    notes?: string;
  }) => req("/initiate", payload),
  approve:   (id: string) => req(`/approve?id=${encodeURIComponent(id)}`),
  authorize: (id: string) => req(`/authorize?id=${encodeURIComponent(id)}`),
  execute:   (id: string) => req(`/execute?id=${encodeURIComponent(id)}`),
  status:    (id: string) => req(`/status?id=${encodeURIComponent(id)}`, undefined, "GET"),
};
// src/lib/q.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiGet } from "../lib/ecc-api";

// Small helpers so cards NEVER change hook counts between renders.
export type Id = string | number;

type ListParams = Record<string, string | number | boolean | null | undefined>;
function toQuery(params?: ListParams) {
  if (!params) return "";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export function useOne<T>(path: string, id: Id | null): UseQueryResult<T | null> {
  return useQuery<T | null>({
    queryKey: ["one", path, id],
    enabled: id !== null && id !== undefined && String(id).length > 0,
    queryFn: async () => {
      if (id === null || id === undefined) return null;
      // prefer row endpoint, fall back to filter form (prevents 404 breakage)
      try {
        return await apiGet<T>(`${path}/${id}`);
      } catch {
        const rows = await apiGet<T[]>(`${path}${toQuery({ "id": `eq.${id}`, limit: 1 })}`);
        return rows?.[0] ?? null;
      }
    },
    staleTime: 60_000,
  });
}

export function useList<T>(path: string, params?: ListParams, enabled = true): UseQueryResult<T[]> {
  return useQuery<T[]>({
    queryKey: ["list", path, params],
    enabled,
    queryFn: async () => {
      const url = `${path}${toQuery(params)}`;
      const rows = await apiGet<T[]>(url);
      return Array.isArray(rows) ? rows : [];
    },
    staleTime: 60_000,
  });
}
// src/lib/useApi.ts
import { useEffect, useMemo, useState } from "react";

export type ApiResult<T> = {
  data: T;
  loading: boolean;
  error: Error | null;
};

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    usp.set(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetcher that tries multiple URL patterns until one returns OK.
 * Returns parsed JSON (any) or throws Error.
 */
async function getFirstOk(urls: string[]): Promise<any> {
  let lastErr: any = null;
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { Accept: "application/json" } });
      if (!r.ok) {
        lastErr = new Error(`${r.status} ${r.statusText} for ${u}`);
        continue;
      }
      return await r.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("No endpoint responded OK");
}

/**
 * Normalizes variations of server responses:
 *  - array
 *  - { items: T[] }
 *  - { data: T[] }
 *  - { results: T[] }
 */
function normalizeArray<T = any>(j: any): T[] {
  if (Array.isArray(j)) return j as T[];
  if (Array.isArray(j?.items)) return j.items as T[];
  if (Array.isArray(j?.data)) return j.data as T[];
  if (Array.isArray(j?.results)) return j.results as T[];
  // allow single object
  if (j && typeof j === "object") return [j as T];
  return [];
}

/**
 * useCollection — simple collection hook with sensible defaults.
 * Tries several common REST shapes for the ECC backend.
 */
export function useCollection<T = any>(
  collection: string,
  params?: Record<string, any>
): ApiResult<T[]> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const qs = useMemo(() => buildQuery(params), [params]);

  useEffect(() => {
    let off = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const urls = [
          `/api/${collection}${qs}`,
          `/api/${collection}/list${qs}`,
          `/api/v1/${collection}${qs}`,
          `/${collection}${qs}`,
        ];
        const j = await getFirstOk(urls);
        const rows = normalizeArray<T>(j);
        if (!off) setData(rows);
      } catch (e: any) {
        if (!off) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!off) setLoading(false);
      }
    };
    load();
    return () => {
      off = true;
    };
  }, [collection, qs]);

  return { data, loading, error };
}

// src/lib/useApi.ts
import { useEffect, useMemo, useState } from "react";

export type ApiResult<T> = {
  data: T;
  loading: boolean;
  error: Error | null;
};

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

async function tryFetchJSON(u: string): Promise<{ ok: boolean; status: number; json?: any }> {
  const r = await fetch(u, { headers: { Accept: "application/json" } });
  if (!r.ok) return { ok: false, status: r.status };
  try { return { ok: true, status: r.status, json: await r.json() }; }
  catch { return { ok: true, status: r.status, json: [] }; }
}

function normalizeArray<T = any>(j: any): T[] {
  if (Array.isArray(j)) return j as T[];
  if (Array.isArray(j?.items)) return j.items as T[];
  if (Array.isArray(j?.data)) return j.data as T[];
  if (Array.isArray(j?.results)) return j.results as T[];
  if (j && typeof j === "object") return [j as T];
  return [];
}

/**
 * useCollection — fetches a collection with graceful fallbacks.
 * - tries multiple URL shapes
 * - 404 -> treated as "no results" (empty data, no error)
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

        let lastNon404: { status: number; err: Error } | null = null;
        let rows: T[] | null = null;

        for (const u of urls) {
          const res = await tryFetchJSON(u);
          if (!res.ok) {
            if (res.status === 404) continue; // try next shape
            lastNon404 = { status: res.status, err: new Error(`${res.status} for ${u}`) };
            continue;
          }
          rows = normalizeArray<T>(res.json);
          break;
        }

        if (rows === null) {
          // no endpoint responded OK; treat all-404 as empty, else surface last error
          if (!lastNon404) rows = []; // all were 404
          else throw lastNon404.err;
        }

        if (!off) setData(rows);
      } catch (e: any) {
        if (!off) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!off) setLoading(false);
      }
    };
    load();
    return () => { off = true; };
  }, [collection, qs]);

  return { data, loading, error };
}

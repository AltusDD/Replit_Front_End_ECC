import { useEffect, useState } from "react";
import { getApiBase } from "@/lib/config";

type JsonValue = unknown;
type FetchOpts = {
  /** Optional query params (e.g., { limit: 100 }) */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Override base (rare) */
  baseUrl?: string;
};

function toQuery(params?: Record<string, any>) {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.set(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function parseSmart(res: Response) {
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (ct.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`JSON parse error: ${(e as Error).message}`);
    }
  }
  // Not JSON: include first 160 chars so we can see if it's <!doctype ...>
  const head = text.slice(0, 160).replace(/\s+/g, " ").trim();
  throw new Error(`Non-JSON response (${res.status} ${res.statusText}): ${head}`);
}

/**
 * Generic collection fetcher for ECC Portfolio v3.
 * GET {base}/portfolio/{collection}
 */
export function useCollection<T = JsonValue>(
  collection:
    | "properties"
    | "units"
    | "leases"
    | "tenants"
    | "owners"
    | (string & {}),
  opts: FetchOpts = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const base = (opts.baseUrl || getApiBase()).replace(/\/+$/, "");
    const url = `${base}/portfolio/${collection}${toQuery(opts.params)}`;

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          // try to parse body for a better message
          try {
            await parseSmart(res);
          } catch (e) {
            throw e;
          }
        }
        const body = await parseSmart(res);
        const rows = Array.isArray(body) ? body : (body as any)?.data ?? [];
        setData(rows as T[]);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : String(e));
          setData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [collection, JSON.stringify(opts.params), opts.baseUrl]);

  return { data, loading, error };
}

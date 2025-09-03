import { useEffect, useState } from "react";

export function useCollection<T = any>(
  collection: "properties" | "units" | "leases" | "tenants" | "owners"
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/portfolio/${collection}`, {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        let json: any;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(`Non-JSON from /api/portfolio/${collection}: ${text.slice(0,160)}…`);
        }

        if (!res.ok) {
          const msg = json?.message || json?.error || res.statusText || "Unknown API error";
          const extra = [json?.code, json?.details, json?.hint].filter(Boolean).join(" · ");
          throw new Error(extra ? `${msg} — ${extra}` : msg);
        }

        const rows = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        setData(rows);
      } catch (e: any) {
        if (!ac.signal.aborted) setError(String(e?.message || e));
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [collection]);

  return { data, loading, error };
}

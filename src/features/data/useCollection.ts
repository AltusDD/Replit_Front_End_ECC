/* /src/features/data/useCollection.ts
   Robust collection fetch hook (named + default export).
   - Handles abort on unmount/navigation
   - Accepts either a URL string or null/undefined (returns empty)
   - Normalizes { data: [...] } or raw [] payloads
*/
import { useEffect, useRef, useState } from "react";

export type UseCollectionResult<T = any> = {
  data: T[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useCollection<T = any>(url?: string | null): UseCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bumpRef = useRef(0);

  const reload = () => {
    bumpRef.current++;
    setError(null);
  };

  useEffect(() => {
    if (!url) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Cleanup previous controller before creating new one
    if (abortRef.current && !abortRef.current.signal.aborted) {
      abortRef.current.abort();
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (ctrl.signal.aborted) return; // Early exit if aborted during fetch
        
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();

        if (ctrl.signal.aborted) return; // Early exit if aborted during parsing

        // Normalize array payloads
        const arr: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const debug = typeof location !== "undefined" &&
          new URLSearchParams(location.search).get("debug") === "1";
        
        if (debug && Array.isArray(json) && json.length) {
          // eslint-disable-next-line no-console
          console.log(url, "sample", json[0]);
        }

        if (!ctrl.signal.aborted) {
          setData(arr as T[]);
          setError(null);
        }
      } catch (e: any) {
        if (e?.name === "AbortError" || ctrl.signal.aborted) {
          return; // Silently ignore aborted operations
        }
        
        if (!ctrl.signal.aborted) {
          setError(e?.message || "Failed to load");
          setData([]);
        }
      } finally {
        if (!ctrl.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      if (ctrl && !ctrl.signal.aborted) {
        ctrl.abort();
      }
    };
  }, [url, bumpRef.current]);

  return { data, loading, error, reload };
}

export default useCollection;
// Network utilities for Genesis Dashboard

export async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${url}`);
  return res.json() as Promise<T>;
}

export const isAbortError = (e: unknown) =>
  (e as any)?.name === "AbortError" || /aborted|abort/i.test((e as any)?.message || "");
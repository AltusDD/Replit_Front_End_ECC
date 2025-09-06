// Network utilities for Genesis Dashboard

export const isAbortError = (e: unknown): boolean =>
  e instanceof DOMException && e.name === "AbortError";

// Dev mode AbortError suppression (optional, dev-only)
if (import.meta.env.DEV) {
  window.addEventListener("unhandledrejection", (ev) => {
    if (isAbortError(ev.reason)) ev.preventDefault();
  });
}

export async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, credentials: "include" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
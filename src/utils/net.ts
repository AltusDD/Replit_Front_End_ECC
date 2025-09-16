// Network utilities for Genesis Dashboard

export async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const res = await fetch(url, { signal, headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${url}`);
    return res.json() as Promise<T>;
  } catch (err) {
    // Suppress AbortError in development to reduce console noise
    if (isAbortError(err)) {
      // Re-throw AbortError silently for proper cleanup
      const suppressedErr = new Error("Request aborted");
      suppressedErr.name = "AbortError";
      throw suppressedErr;
    }
    throw err;
  }
}

export const isAbortError = (e: unknown) =>
  (e as any)?.name === "AbortError" || /aborted|abort/i.test((e as any)?.message || "");

// Dev mode AbortError suppression
if (import.meta.env.DEV) {
  window.addEventListener("unhandledrejection", (ev) => {
    if (isAbortError(ev.reason)) {
      ev.preventDefault();
    }
  });
}
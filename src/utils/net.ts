// Network utilities for Genesis Dashboard

export const isAbortError = (e: any): boolean =>
  !!e && (e.name === "AbortError" || e.code === 20 || String(e).includes("AbortError"));

export async function fetchJSON<T = any>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(url, { 
    credentials: 'include',
    signal 
  });
  
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`);
  }
  
  return (await res.json()) as T;
}
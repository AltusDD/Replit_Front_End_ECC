// src/lib/ecc-api-client.ts
export type Json = any;

/** Simplified fetch that expects raw JSON from server */
export async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return (await r.json()) as T; // server already returns raw JSON
}

/** Money (cents → $X,XXX.xx) */
export function money(cents?: number | null): string {
  const n = Number(cents ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })
    .format(n / 100);
}
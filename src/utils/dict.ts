// src/utils/dict.ts
export type Index<T> = Record<string | number, T>;
export type Group<T> = Record<string | number, T[]>;

// Accepts either a string key or a callback
export function indexBy<T>(rows: T[], key: keyof T | ((r: T) => string | number)): Index<T> {
  const fn = typeof key === "function" ? key : (r: any) => r?.[key] as any;
  const out: Index<T> = {};
  for (const r of rows || []) {
    const k = fn(r);
    if (k != null) out[k] = r;
  }
  return out;
}

export function groupBy<T>(rows: T[], key: keyof T | ((r: T) => string | number)): Group<T> {
  const fn = typeof key === "function" ? key : (r: any) => r?.[key] as any;
  const out: Group<T> = {};
  for (const r of rows || []) {
    const k = fn(r);
    if (k == null) continue;
    if (!out[k]) out[k] = [];
    out[k].push(r);
  }
  return out;
}

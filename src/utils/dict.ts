type Keyer<T> = keyof T | ((r: T) => string | number);

function toKey<T>(key: Keyer<T>) {
  return typeof key === "function"
    ? key
    : (r: T) => (r as any)[key] as string | number;
}

export function indexBy<T>(rows: T[], key: Keyer<T>): Map<string | number, T> {
  const k = toKey(key);
  const out = new Map<string | number, T>();
  for (const r of rows || []) {
    const kk = k(r);
    if (kk != null) out.set(kk, r);
  }
  return out;
}

export function groupBy<T>(rows: T[], key: Keyer<T>): Map<string | number, T[]> {
  const k = toKey(key);
  const out = new Map<string | number, T[]>();
  for (const r of rows || []) {
    const kk = k(r);
    if (kk == null) continue;
    if (!out.has(kk)) out.set(kk, []);
    out.get(kk)!.push(r);
  }
  return out;
}

/* Keep old imports working: some pages import money from "@/utils/dict" */
export { money, percent, shortDate, boolText } from "./format";

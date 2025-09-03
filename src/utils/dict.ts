export function indexBy<T, K extends string | number>(rows: T[], key: (r: T) => K): Record<K, T> {
  const out = {} as Record<K, T>;
  for (const r of rows) out[key(r)] = r;
  return out;
}
export function groupBy<T, K extends string | number>(rows: T[], key: (r: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const r of rows) {
    const k = key(r);
    (out[k] ||= []).push(r);
  }
  return out;
}
/* Re-export for compatibility: some pages do `import { money } from "@/utils/dict"` */
export { money, percent, shortDate, boolText } from "./format";

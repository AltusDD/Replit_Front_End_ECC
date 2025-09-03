export function indexBy<T extends Record<string, any>>(rows: T[], key: keyof T) {
  const m = new Map<any, T>();
  for (const r of rows || []) m.set(r?.[key], r);
  return m;
}
export function groupBy<T extends Record<string, any>>(rows: T[], key: keyof T) {
  const m = new Map<any, T[]>();
  for (const r of rows || []) {
    const k = r?.[key];
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(r);
  }
  return m;
}
export const money = (v: any) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : v == null ? "" : String(v);
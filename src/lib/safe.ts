export function asArray<T>(v: T | T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : v == null ? [] : [v];
}
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Partial<Pick<T, K>> {
  const out: Partial<Pick<T, K>> = {};
  for (const k of keys) if (obj && obj[k] != null) out[k] = obj[k];
  return out;
}
export function safeNum(v: any, d = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}
export function truncate(v: any, n = 80): string {
  const s = String(v ?? '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
export function get(o: any, path: string, d?: any) {
  try {
    return path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o) ?? d;
  } catch {
    return d;
  }
}

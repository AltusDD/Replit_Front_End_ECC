export function asArray<T>(v: T | T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : v == null ? [] : [v];
}
export function truncate(v: any, n = 140) {
  const s = String(v ?? '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

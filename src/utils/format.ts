export function money(n: any): string {
  const num = Number(n ?? 0);
  return Number.isFinite(num)
    ? num.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "—";
}
export function percent(n: any, digits = 1): string {
  if (n == null || n === "") return "—";
  let v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v > 1.000001) return `${v.toFixed(digits)}%`;
  return `${(v * 100).toFixed(digits)}%`;
}
export function shortDate(s: any): string {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().slice(0, 10);
}
export function boolText(v: any): string {
  return String(!!v);
}

export const money = (v: any) => {
  if (typeof v === "number") return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) {
    return Number(v).toLocaleString(undefined, { style: "currency", currency: "USD" });
  }
  return "—";
};
export const percent = (v: any, digits = 1) => {
  const n = typeof v === "number" ? v : Number(v);
  return isFinite(n) ? `${n.toFixed(digits)}%` : "—";
};
export const shortDate = (v: any) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(+d) ? "—" : d.toISOString().slice(0,10);
};
export const boolText = (v: any) => (v ? "true" : "false");
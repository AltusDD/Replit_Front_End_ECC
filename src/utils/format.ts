export const money = (v: any) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))
    ? Number(v).toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "—";

export const percent = (v: any, digits = 1) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
};

export const shortDate = (v: any) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(+d) ? "—" : d.toISOString().slice(0,10);
};

export const boolText = (v: any) => (v ? "true" : "false");
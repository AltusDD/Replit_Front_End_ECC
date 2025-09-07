export const safeNum = (v: any, def = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export const fmtMoney = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n)
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "$0";

// Mon D, YYYY (e.g., Sep 6, 2025)
export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export const fmtPct = (n?: number | null, digits = 1) =>
  typeof n === "number" && Number.isFinite(n)
    ? `${n.toFixed(digits)}%`
    : `${(0).toFixed(digits)}%`;

export const fmtCompact = (n?: number | null): string => {
  if (n == null || Number.isNaN(n)) return "—";
  return Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
};

export function pct(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

export function money(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "$0";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Back-compat aliases (some files import these names) */
export const money = fmtMoney;
export const percent = fmtPct;
export const date = fmtDate;
export const formatMoney = fmtMoney;
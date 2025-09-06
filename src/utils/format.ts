// Genesis v2 Format Helpers - Exact Specification

export const fmtDate = (iso?: string | Date | null) =>
  !iso ? "—" : new Date(iso).toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" });

export const fmtMoney = (n?: number | null) => {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "$0";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

export const fmtPct = (n?: number | null, digits=1) =>
  (n==null || Number.isNaN(n)) ? "—" : `${n.toFixed(digits)}%`;

export const fmtCompact = (n?: number | null) => {
  if (n == null || Number.isNaN(n)) return "—";
  return Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
};

export function pct(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

// Legacy aliases for compatibility
export const money = fmtMoney;
export const percent = fmtPct;
export const shortDate = fmtDate;
export const dash = "—";
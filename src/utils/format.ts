// Genesis v2 Format Helpers - Exact Specification

export const fmtDate = (iso?: string | null) =>
  !iso ? "—" : new Date(iso).toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  }); // Mon D, YYYY

export const fmtMoney = (n?: number | null) => {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "$0";
  return n.toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  });
};

export const fmtPct = (n?: number | null, dp = 1) => {
  if (n == null || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(dp)}%`;
};

export const fmtCompact = (n?: number | null) => {
  if (n == null || Number.isNaN(n)) return "—";
  return Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
};

// Legacy aliases for compatibility
export const money = fmtMoney;
export const percent = fmtPct;
export const shortDate = fmtDate;
export const dash = "—";
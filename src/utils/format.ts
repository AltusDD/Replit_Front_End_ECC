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
  return (typeof n === "number" ? n : 0).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  });
};

export const fmtPct = (n?: number | null, dp = 1) => {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(dp)}%`;
};

export const plural = (n: number, s: string) => 
  `${n} ${n === 1 ? s : `${s}s`}`;

// Additional utilities for dashboard
export const fmtCompact = (n?: number | null) => {
  if (n == null || Number.isNaN(n)) return "—";
  
  const absN = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  
  if (absN >= 1000000) {
    return `${sign}${(absN / 1000000).toFixed(1)}M`;
  } else if (absN >= 1000) {
    return `${sign}${(absN / 1000).toFixed(1)}K`;
  } else {
    return `${sign}${absN.toLocaleString()}`;
  }
};

export const fmtDays = (days?: number | null) => {
  if (days == null || Number.isNaN(days)) return "—";
  
  const absDays = Math.abs(days);
  if (absDays === 1) return "1 day";
  return `${Math.round(absDays)} days`;
};

// Legacy aliases for compatibility with existing portfolio pages
export const dash = "—";
export const money = fmtMoney;
export const percent = fmtPct;
export const shortDate = fmtDate;
// Global formatting utilities - Genesis specification

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
    maximumFractionDigits: 2 
  });
};

export const fmtPct = (v?: number | null, digits = 1) => 
  (v == null ? "—" : `${v.toFixed(digits)}%`);

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
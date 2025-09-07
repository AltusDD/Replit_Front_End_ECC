export const safeNum = (v: any, def = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export const fmtMoney = (n?: number | null): string => {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "$0";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

// Mon D, YYYY (e.g., Sep 6, 2025)
export const fmtDate = (input?: string | Date | null): string => {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fmtPct = (n?: number | null, digits = 1): string => {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
};

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

// Legacy aliases for compatibility
export const percent = fmtPct;
export const date = fmtDate;
export const shortDate = fmtDate;
export const formatMoney = fmtMoney;
export const formatPercent = fmtPct;
export const formatDate = fmtDate;
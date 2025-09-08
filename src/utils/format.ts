// src/utils/format.ts

export function fmtMoney(
  value?: number | null,
  opts: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }
): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "$0";
  return value.toLocaleString("en-US", opts);
}

export function fmtPct(value?: number | null, digits = 1): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `${n.toFixed(digits)}%`;
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtCompact(n?: number | null): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
}

/**
 * Back-compat named exports.
 * These are *re-exports* (aliases), not new declarations — so there are no duplicate symbols.
 */
export {
  fmtMoney as money,
  fmtPct as percent,
  fmtDate as date,
  fmtDate as shortDate,
  fmtMoney as formatMoney,
};

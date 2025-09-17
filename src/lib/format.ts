export const BLANK = "—";

function toNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * formatNumber
 * - Default decimals = 0 (so formatNumber(0) === "0")
 * - Invalid values -> BLANK
 */
export function formatNumber(value: any, decimals = 0): string {
  const n = toNumber(value);
  if (n === null) return BLANK;
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * formatPercent
 * - basis 'fraction' means value in [0,1] (e.g., 0.125 => 12.5%)
 * - basis 'percent' means value already in [0,100] (e.g., 12.5 => 12.5%)
 * - Invalid values -> BLANK
 */
export function formatPercent(
  value: any,
  decimals = 1,
  basis: "fraction" | "percent" = "fraction"
): string {
  const n = toNumber(value);
  if (n === null) return BLANK;
  const pct = basis === "fraction" ? n * 100 : n;
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(pct);
  return `${formatted}%`;
}

/**
 * formatCurrencyFromCents
 * - Accepts integer cents
 * - Invalid values -> BLANK
 */
export function formatCurrencyFromCents(cents: any, currency = "USD"): string {
  const n = toNumber(cents);
  if (n === null) return BLANK;
  const dollars = n / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(dollars);
}

/** Optional helper used in a few UIs */
export function titleCase(input?: string | null): string {
  if (!input) return BLANK;
  const s = String(input).replace(/_/g, " ").toLowerCase();
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
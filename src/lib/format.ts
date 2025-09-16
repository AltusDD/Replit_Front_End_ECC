export function titleCase(input?: string | null): string {
  if (!input) return "—";
  const s = String(input).replace(/_/g, " ").toLowerCase();
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function humanize(input?: string | null): string {
  if (!input) return "—";
  // Preserve digits/symbols; normalize underscores and shouty text
  return titleCase(input);
}

export function fmtMoneyCents(cents?: number | null): string {
  if (cents == null) return "—";
  const dollars = Math.round(cents) / 100;
  try {
    return dollars.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  } catch {
    return `$${Math.round(dollars)}`;
  }
}

export function joinAddress(parts: Array<string | null | undefined>): string {
  const out = parts.filter(Boolean).join(", ");
  return out || "—";
}

export function googleMapsHref(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
}

export function isFiniteNumber(n: any): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function moneyCents(n?: number | null) {
  if (n == null) return "—"; 
  const d = Math.round(n)/100;
  try { 
    return d.toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0}); 
  }
  catch { 
    return `$${Math.round(d)}`; 
  }
}

// Blank constant for consistent fallback display
export const BLANK = "—";

// Small cache for number formatters - tree-shakable, pure behavior
const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(decimals: number): Intl.NumberFormat {
  const key = `number-${decimals}`;
  if (!numberFormatCache.has(key)) {
    numberFormatCache.set(key, new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }));
  }
  return numberFormatCache.get(key)!;
}

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  const key = `currency-${currency}`;
  if (!numberFormatCache.has(key)) {
    numberFormatCache.set(key, new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  }
  return numberFormatCache.get(key)!;
}

/**
 * Format a number with specified decimal places
 * Handles null/undefined/NaN/Infinity -> returns BLANK
 * Accepts numbers or stringy numbers; uses Number(value) coerce
 * Clamps decimals 0–3
 */
export function formatNumber(value: any, options: { decimals?: number } = {}): string {
  const { decimals = 0 } = options;
  
  // Handle null/undefined
  if (value == null) return BLANK;
  
  // Coerce to number
  const num = Number(value);
  
  // Handle NaN/Infinity
  if (!Number.isFinite(num)) return BLANK;
  
  // Clamp decimals 0-3
  const clampedDecimals = Math.max(0, Math.min(3, decimals));
  
  return getNumberFormatter(clampedDecimals).format(num);
}

/**
 * Format a ratio as percentage
 * Accepts either 0–1 (fraction) or 0–100 (percent)
 * Uses basis option to avoid double-% bugs, default 'fraction'
 * Returns BLANK for invalid inputs; formats like 12.3%
 */
export function formatPercent(ratio: any, options: { decimals?: number; basis?: 'fraction' | 'percent' } = {}): string {
  const { decimals = 1, basis = 'fraction' } = options;
  
  // Handle null/undefined
  if (ratio == null) return BLANK;
  
  // Coerce to number
  const num = Number(ratio);
  
  // Handle NaN/Infinity
  if (!Number.isFinite(num)) return BLANK;
  
  // Convert based on basis
  const percent = basis === 'fraction' ? num * 100 : num;
  
  // Clamp decimals 0-3
  const clampedDecimals = Math.max(0, Math.min(3, decimals));
  
  return `${getNumberFormatter(clampedDecimals).format(percent)}%`;
}

/**
 * Format currency from cents
 * Cents must be integer; coerce numbers but guard strings that aren't numeric -> returns BLANK
 * Negative values display as -$1,234.56 (relying on Intl negative formatting)
 * Pure, cached Intl.NumberFormat by currency
 */
export function formatCurrencyFromCents(cents: any, options: { currency?: string } = {}): string {
  const { currency = 'USD' } = options;
  
  // Handle null/undefined
  if (cents == null) return BLANK;
  
  // For strings, check if they're numeric
  if (typeof cents === 'string') {
    const trimmed = cents.trim();
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return BLANK;
  }
  
  // Coerce to number
  const num = Number(cents);
  
  // Handle NaN/Infinity
  if (!Number.isFinite(num)) return BLANK;
  
  // Convert cents to dollars
  const dollars = num / 100;
  
  return getCurrencyFormatter(currency).format(dollars);
}
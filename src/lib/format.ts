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

// BLANK constant for safe fallbacks
export const BLANK = "—";

// Format number with optional decimals
export function formatNumber(value?: number | null, decimals: number = 0): string {
  if (value == null || !Number.isFinite(value)) return BLANK;
  return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

// Format currency from cents
export function formatCurrencyFromCents(cents?: number | null): string {
  if (cents == null || !Number.isFinite(cents)) return BLANK;
  const dollars = cents / 100;
  try {
    return dollars.toLocaleString(undefined, { 
      style: "currency", 
      currency: "USD", 
      maximumFractionDigits: 0 
    });
  } catch {
    return `$${Math.round(dollars).toLocaleString()}`;
  }
}

// Format percentage with configurable basis and decimals
export function formatPercent(
  value?: number | null, 
  options?: { decimals?: number; basis?: 'fraction' | 'percent' }
): string {
  if (value == null || !Number.isFinite(value)) return BLANK;
  
  const { decimals = 1, basis = 'percent' } = options || {};
  const percentage = basis === 'fraction' ? value * 100 : value;
  
  return `${percentage.toFixed(decimals)}%`;
}
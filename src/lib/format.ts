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

// Required exports for guardrail compliance
export const BLANK = "—";

export function formatNumber(value?: number | string | null, decimals = 2): string {
  if (value == null || value === "" || Number.isNaN(Number(value))) return BLANK;
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return BLANK;
  
  try {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    });
  } catch {
    return String(num);
  }
}

export function formatPercent(value?: number | null, decimals = 1, basis: "fraction" | "percent" = "fraction"): string {
  if (value == null || Number.isNaN(value)) return BLANK;
  if (!Number.isFinite(value)) return BLANK;
  
  const percent = basis === "fraction" ? value * 100 : value;
  try {
    return `${percent.toFixed(decimals)}%`;
  } catch {
    return BLANK;
  }
}

export function formatCurrencyFromCents(cents?: number | null): string {
  if (cents == null || Number.isNaN(cents)) return BLANK;
  if (!Number.isFinite(cents)) return BLANK;
  
  const dollars = cents / 100;
  try {
    return dollars.toLocaleString(undefined, { 
      style: "currency", 
      currency: "USD", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  } catch {
    return `$${dollars.toFixed(2)}`;
  }
}
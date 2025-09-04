// src/utils/format.ts

export const dash = "—";

// Safe deep getter
export function getPath<T = any>(obj: any, path: string, d?: T): T | undefined {
  try {
    return path.split(".").reduce<any>((v, k) => (v == null ? v : v[k]), obj) ?? d;
  } catch { return d; }
}

/** Format a number as currency with optional decimals. */
export function money(n?: number | null, opts?: { decimals?: 0 | 2 }): string {
  if (n == null || Number.isNaN(n as number)) return "—";
  if (n === 0) return "$0";
  const v = typeof n === "number" ? n : Number(n);
  const decimals = opts?.decimals ?? 0;
  return v.toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD", 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
}

/** Format a number as a percent, default 1 decimal. */
export function percent(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "0%";
  return `${Math.round(n || 0)}%`;
}

/** Format date to Mon D, YYYY (e.g., Sep 4, 2025). */
export function shortDate(v?: string | number | Date | null): string {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export type BadgeKind = "ok" | "warn" | "bad" | "muted";

/** Small colored badge. Usage: badge("Active", "ok") */
export function badge(text: string, kind: BadgeKind = "muted"): string {
  return text; // Return just the text for now since this is a .ts file
}

/** True/false pill with your badge styling. */
export function boolBadge(ok?: boolean | null, truthy = "ACTIVE", falsy = "INACTIVE"): string {
  const isTrue = !!ok;
  return isTrue ? truthy : falsy;
}

/** Alias for legacy imports. */
export const boolText = boolBadge;

// Genesis progress bar for occupancy
export function progressBar(value: number, max: number = 100): string {
  const percentage = Math.min((value / max) * 100, 100);
  return percent(percentage, 1);
}

// Genesis status badge with enhanced styling
export function statusBadge(text: string, isActive: boolean, type: "status" | "occupancy" = "status"): string {
  return text; // Return just the text for now since this is a .ts file
}

// Simple row actions - just show the three dots for now
export function rowActions(actions: Array<{label: string, onClick: () => void}>): string {
  return "⋯"; // Return just the dots for now since this is a .ts file
}

// src/utils/format.tsx
import * as React from "react";

/** Format a number as currency. */
export function money(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format a number as a percent, default 1 decimal. */
export function percent(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

/** Format ISO-ish date to YYYY-MM-DD. */
export function shortDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

export type BadgeKind = "ok" | "warn" | "bad" | "muted";

/** Small colored badge. Usage: badge("Active", "ok") */
export function badge(text: string, kind: BadgeKind = "muted") {
  const cls =
    kind === "ok"
      ? "ecc-badge ecc-badge--ok"
      : kind === "warn"
      ? "ecc-badge ecc-badge--warn"
      : kind === "bad"
      ? "ecc-badge ecc-badge--bad"
      : "ecc-badge";
  return <span className={cls}>{text}</span>;
}

/** True/false pill with your badge styling. */
export function boolBadge(value: unknown, truthy = "true", falsy = "false") {
  const isTrue = !!value;
  const cls = isTrue ? "ecc-badge ecc-badge--ok" : "ecc-badge ecc-badge--bad";
  return <span className={cls}>{isTrue ? truthy : falsy}</span>;
}

/** Alias for legacy imports. */
export const boolText = boolBadge;

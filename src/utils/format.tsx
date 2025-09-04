// src/utils/format.tsx
import * as React from "react";

export function money(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function percent(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

export function shortDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Small colored badge. kind: ok | warn | bad | muted */
export function badge(kind: "ok" | "warn" | "bad" | "muted" = "muted", text: string) {
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

/** True/false pill with your badge styling */
export function boolText(value: unknown, truthy = "true", falsy = "false") {
  const isTrue = !!value;
  const cls = isTrue ? "ecc-badge ecc-badge--ok" : "ecc-badge ecc-badge--bad";
  return <span className={cls}>{isTrue ? truthy : falsy}</span>;
}

/** Alias for compatibility */
export const boolText = boolBadge;

/** Small colored badge. kind: ok | warn | bad | muted */
export function badge(kind: "ok" | "warn" | "bad" | "muted" = "muted", text: string) {
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

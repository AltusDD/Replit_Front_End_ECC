// src/utils/format.ts
import React from "react";

export function money(v: any): string {
  if (v == null || v === "") return "—";
  const n = typeof v === "string" ? Number(v) : v;
  // If it's clearly cents, normalize; otherwise assume dollars
  const dollars = n > 100000 ? n / 100 : n;
  return dollars.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function percent(n: any, digits = 1): string {
  if (n == null || isNaN(Number(n))) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

export function shortDate(d: any): string {
  if (!d) return "—";
  const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toISOString().slice(0, 10);
}

export function boolText(b: any): string {
  return b ? "true" : "false";
}

/**
 * Badge without JSX so it compiles in a .ts file.
 * Returns a React element using React.createElement.
 */
export function badge(kind: "ok" | "warn" | "bad", text: string): React.ReactElement {
  const cls =
    kind === "ok" ? "ecc-badge ecc-badge--ok"
    : kind === "warn" ? "ecc-badge ecc-badge--warn"
    : "ecc-badge ecc-badge--bad";
  return React.createElement("span", { className: cls }, text);
}

// src/utils/format.tsx
import * as React from "react";

export const dash = "—";

// Safe deep getter
export function getPath<T = any>(obj: any, path: string, d?: T): T | undefined {
  try {
    return path.split(".").reduce<any>((v, k) => (v == null ? v : v[k]), obj) ?? d;
  } catch { return d; }
}

/** Format a number as currency. */
export function money(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const v = typeof n === "number" ? n : 0;
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** Format a number as a percent, default 1 decimal. */
export function percent(n?: number | null, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "0%";
  return `${Math.round(n || 0)}%`;
}

/** Format ISO-ish date to YYYY-MM-DD. */
export function shortDate(iso?: string | null): string {
  if (!iso) return dash;
  const d = new Date(iso);
  return Number.isNaN(+d) ? dash : d.toISOString().slice(0,10);
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
export function boolBadge(ok?: boolean | null, truthy = "ACTIVE", falsy = "INACTIVE") {
  const isTrue = !!ok;
  const cls = isTrue ? "ecc-badge ecc-badge--ok" : "ecc-badge ecc-badge--bad";
  return <span className={cls}>{isTrue ? truthy : falsy}</span>;
}

/** Alias for legacy imports. */
export const boolText = boolBadge;

// Genesis progress bar for occupancy
export function progressBar(value: number, max: number = 100) {
  const percentage = Math.min((value / max) * 100, 100);
  const displayText = percent(percentage, 1);
  
  return (
    <div className="ecc-progress-bar">
      <div className="ecc-progress-bg">
        <div 
          className="ecc-progress-fg" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="ecc-progress-text">{displayText}</span>
    </div>
  );
}

// Genesis status badge with enhanced styling
export function statusBadge(text: string, isActive: boolean, type: "status" | "occupancy" = "status") {
  let kind: BadgeKind = "muted";
  
  if (type === "occupancy") {
    const value = parseFloat(text.replace('%', ''));
    if (value >= 90) kind = "ok";
    else if (value >= 70) kind = "warn";
    else kind = "bad";
  } else {
    kind = isActive ? "ok" : "bad";
  }
  
  return badge(text, kind);
}

// Simple row actions - just show the three dots for now
export function rowActions(actions: Array<{label: string, onClick: () => void}>) {
  return (
    <button 
      className="ecc-actions-trigger"
      onClick={(e) => {
        e.stopPropagation();
        // For now, just show the first action
        if (actions.length > 0) {
          actions[0].onClick();
        }
      }}
      title="Actions"
    >
      ⋯
    </button>
  );
}

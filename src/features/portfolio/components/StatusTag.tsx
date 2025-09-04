import React from "react";

type Props = { value?: string | null };

export default function StatusTag({ value }: Props) {
  const v = String(value ?? "").trim().toLowerCase();

  // Semantic groups
  const good = new Set(["active", "occupied", "ok", "true", "yes", "current", "paid", "on_time"]);
  const warn = new Set(["pending", "hold", "warn", "warning", "processing", "unknown"]);
  const bad  = new Set(["ended", "vacant", "inactive", "false", "no", "delinquent", "past_due", "overdue", "litigation", "bad"]);

  // Default base class
  let cls = "ecc-badge";
  if (good.has(v)) cls += " ecc-badge--ok";
  else if (warn.has(v)) cls += " ecc-badge--warn";
  else if (bad.has(v)) cls += " ecc-badge--bad";
  else cls += " ecc-badge--warn";
  
  return <span className={cls}>{(value ?? "").toString().toUpperCase() || "—"}</span>;
}
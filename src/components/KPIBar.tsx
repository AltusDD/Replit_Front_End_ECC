import React from "react";
import "@/styles/table.css";

export type KPI = { label: string; value: React.ReactNode; sub?: string; tone?: "ok"|"warn"|"bad"|"muted" };
export default function KPIBar({ items }: { items: KPI[] }) {
  return (
    <div className="kpi-bar">
      {items.map((k, i) => (
        <div key={i} className={`kpi ${k.tone ?? ""}`}>
          <div className="kpi-value">{k.value}</div>
          <div className="kpi-label">{k.label}{k.sub ? <span className="kpi-sub"> · {k.sub}</span> : null}</div>
        </div>
      ))}
    </div>
  );
}
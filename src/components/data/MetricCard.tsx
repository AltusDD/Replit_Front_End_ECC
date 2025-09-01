// src/components/data/MetricCard.tsx
import React from "react";
import Sparkline from "./Sparkline";

type Props = {
  title: string;
  value: string;
  delta?: number; // positive or negative; % or raw, caller decides text
  suffix?: string;
  series?: number[];
  loading?: boolean;
};

export default function MetricCard({ title, value, delta, suffix, series, loading }: Props) {
  const pos = (delta ?? 0) >= 0;
  return (
    <div className="panel metric-card">
      <div className="metric-head">
        <div className="metric-title">{title}</div>
        {series && <div className="metric-spark"><Sparkline data={series} /></div>}
      </div>
      <div className="metric-main">
        <div className="metric-value">
          {loading ? "…" : value}
          {suffix && <span className="metric-suffix">{suffix}</span>}
        </div>
        {delta != null && (
          <div className={`metric-delta ${pos ? "is-up" : "is-down"}`}>
            {pos ? "▲" : "▼"} {Math.abs(delta).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

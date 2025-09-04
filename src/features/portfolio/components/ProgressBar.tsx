import React from "react";

export default function ProgressBar({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="ecc-progress-bar">
      <div className="ecc-progress-bg">
        <div className="ecc-progress-fg" style={{ width: `${pct}%` }} />
      </div>
      <span className="ecc-progress-text">{pct}%</span>
    </div>
  );
}
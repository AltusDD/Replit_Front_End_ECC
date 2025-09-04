import React from "react";

export default function ProgressBar({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="ecc-occ">
      <div className="ecc-occ-bar"><div style={{ width: `${pct}%` }} /></div>
      <span className="ecc-occ-label">{pct}%</span>
    </div>
  );
}
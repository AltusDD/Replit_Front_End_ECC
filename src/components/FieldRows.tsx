import React from "react";

/** Label/value rows inside a Section */
export function FieldRows({ rows }: { rows: { label: string; value?: React.ReactNode }[] }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8 }}>
          <div className="ecc-label" style={{ textTransform: "none" }}>{r.label}</div>
          <div style={{ textTransform: "none" }}>{r.value ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}
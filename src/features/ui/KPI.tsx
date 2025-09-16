import React from "react";

export default function KPI({
  label,
  value,
  sublabel,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  sublabel?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ecc-object"
      style={{ padding: 12, textAlign: "left", cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ opacity: 0.75, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value ?? "—"}</div>
      {sublabel && <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>{sublabel}</div>}
    </button>
  );
}
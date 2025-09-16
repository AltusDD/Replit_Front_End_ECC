import React from "react";

export default function ActivityChip({
  when,
  what,
  who,
}: {
  when: string;
  what: string;
  who?: string;
}) {
  return (
    <div className="ecc-object" style={{ padding: 8, display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.6)" }} />
      <div style={{ fontWeight: 600 }}>{what}</div>
      <div style={{ opacity: 0.7 }}>• {when}</div>
      {who && <div style={{ opacity: 0.7 }}>• {who}</div>}
    </div>
  );
}
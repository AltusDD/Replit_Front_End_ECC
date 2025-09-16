import React from "react";

export type LegalCase = {
  id: string | number;
  case_number: string;
  kind: "eviction" | "damages" | "quiet_title" | "other";
  status: "open" | "pending" | "closed" | "unknown";
  opened_at?: string | null;
};

export default function LegalCasesList({ items }: { items: LegalCase[] }) {
  if (!items?.length) return <div style={{ opacity:.8 }}>No legal cases linked.</div>;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map(c => (
        <div key={c.id} className="ecc-object" style={{ padding: 12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <div style={{ fontWeight: 700 }}>{c.case_number}</div>
            <div className="ecc-label">{c.kind} • {c.status}</div>
          </div>
          <div className="ecc-label">{c.opened_at ? new Date(c.opened_at).toLocaleDateString() : "Opened: —"}</div>
        </div>
      ))}
    </div>
  );
}
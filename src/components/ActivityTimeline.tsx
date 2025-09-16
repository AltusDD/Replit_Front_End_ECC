import React from "react";

export type ActivityItem = {
  id: string|number;
  ts: string;                // ISO string
  type: string;              // e.g., "workorder.created"
  actor?: string | null;
  text: string;              // display string
};

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  if (!items?.length) return <div style={{ opacity:.8 }}>No activity yet.</div>;
  return (
    <div style={{ display:"grid", gap:10 }}>
      {items.map(it => (
        <div key={it.id} className="ecc-object" style={{ padding:10, display:"grid", gap:4 }}>
          <div style={{ fontSize:12, opacity:.7 }}>{new Date(it.ts).toLocaleString()}</div>
          <div style={{ fontWeight:600 }}>{it.text}</div>
          <div className="ecc-label">{it.type}{it.actor ? ` • ${it.actor}` : ""}</div>
        </div>
      ))}
    </div>
  );
}
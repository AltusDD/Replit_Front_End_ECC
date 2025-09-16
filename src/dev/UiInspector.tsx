import React from "react";

export default function UiInspector({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <section className="ecc-object" role="region" aria-label="UI Inspector">
      <div className="ecc-header">
        <div className="ecc-title">UI Inspector</div>
        <div className="ecc-actions" style={{ display: "flex", gap: 8 }}>
          <button className="ecc-object" onClick={onClose} style={{ padding: "8px 12px" }}>Close</button>
        </div>
      </div>
      <div style={{ opacity: .85 }}>Inspector content renders here (inline). No viewport covering.</div>
    </section>
  );
}
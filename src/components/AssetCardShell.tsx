import React from "react";

export default function AssetCardShell({
  title,
  actions,
  hero,
  tabs,
  rightRail,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  hero?: React.ReactNode;
  tabs: React.ReactNode;        // your <Tabs> with tab content
  rightRail?: React.ReactNode;  // stack of sections
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
      <div>
        <section className="ecc-object" style={{ marginBottom: 12 }}>
          <div className="ecc-header">
            <div className="ecc-title">{title}</div>
            <div className="ecc-actions">{actions}</div>
          </div>
          {hero}
        </section>
        {tabs}
      </div>
      {rightRail ? <aside style={{ display: "grid", gap: 12 }}>{rightRail}</aside> : null}
    </div>
  );
}
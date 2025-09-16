import React from "react";

export default function MiniCard({
  title,
  subtitle,
  onOpen,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onOpen?: () => void;
}) {
  return (
    <div className="ecc-object" style={{ padding: 12 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {subtitle && <div style={{ opacity: 0.75, fontSize: 12 }}>{subtitle}</div>}
      {onOpen && (
        <div style={{ marginTop: 8 }}>
          <button type="button" onClick={onOpen}>Open</button>
        </div>
      )}
    </div>
  );
}
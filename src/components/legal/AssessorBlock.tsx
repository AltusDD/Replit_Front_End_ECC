import React from "react";

export default function AssessorBlock({
  apn, gisUrl
}: { apn?: string | null; gisUrl?: string | null }) {
  return (
    <div className="ecc-object" style={{ padding: 12 }}>
      <div className="ecc-label">Assessor Parcel (APN)</div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{apn ?? "—"}</div>
      <div className="ecc-label">GIS / Assessor Link</div>
      {gisUrl ? <a href={gisUrl} target="_blank" rel="noreferrer">Open GIS</a> : <div style={{ opacity:.8 }}>—</div>}
    </div>
  );
}
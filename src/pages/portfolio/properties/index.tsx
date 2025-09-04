import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "/src/components/DataTable";
import {
  PROPERTY_COLUMNS,
  mapProperty,
  PropertyRow,
} from "../columns";

const ENDPOINT = "/api/portfolio/properties";

async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j = await r.json();
  return Array.isArray(j) ? j : j.data ?? [];
}

export default function PortfolioPropertiesPage() {
  const [raw, setRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setRaw(await fetchJSON(ENDPOINT));
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "Failed to load");
        setRaw([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows: PropertyRow[] = useMemo(() => raw.map(mapProperty), [raw]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const units = rows.reduce((s, r) => s + (r.unit_count ?? 0), 0);
    const avgOcc =
      rows.length === 0
        ? 0
        : rows.reduce((s, r) => s + (r.occupancy ?? 0), 0) / rows.length;
    const active = rows.filter((r) => r.active).length;
    return { total, units, avgOcc, active };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">PROPERTIES</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">UNITS</div><div className="ecc-kpi-n">{kpi.units.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">OCCUPANCY</div><div className="ecc-kpi-n">{kpi.avgOcc.toFixed(1)}%</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ACTIVE PROPS</div><div className="ecc-kpi-n">{kpi.active.toLocaleString()}</div></div>
      </div>

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<PropertyRow>
        rows={rows}
        columns={PROPERTY_COLUMNS}
        loading={loading}
        csvName="properties"
        onRowClick={(row) => {
          // Replace this with your drawer/route
          console.log("open property", row);
        }}
        actions={(row) => (
          <>
            <button onClick={() => console.log("View leases", row)}>View leases</button>
            <button onClick={() => console.log("Work orders", row)}>Open work orders</button>
            <button onClick={() => console.log("Edit property", row)}>Edit details</button>
          </>
        )}
      />
    </div>
  );
}

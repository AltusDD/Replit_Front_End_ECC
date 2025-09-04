import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "/src/components/DataTable";
import { LEASE_COLUMNS, mapLease, LeaseRow } from "../columns";

const ENDPOINT = "/api/portfolio/leases";

async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j = await r.json();
  return Array.isArray(j) ? j : j.data ?? [];
}

export default function PortfolioLeasesPage() {
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

  const rows: LeaseRow[] = useMemo(() => raw.map(mapLease), [raw]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => String(r.status).toLowerCase() === "active").length;
    const ended = rows.filter((r) => String(r.status).toLowerCase() === "ended").length;
    const mrr = rows.reduce((s, r) => s + (r.rent ?? 0), 0);
    const avgRent = mrr / (rows.length || 1);
    return { total, active, ended, mrr, avgRent };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">LEASES</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ACTIVE</div><div className="ecc-kpi-n">{kpi.active.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ENDED</div><div className="ecc-kpi-n">{kpi.ended.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">AVG RENT</div><div className="ecc-kpi-n">${kpi.avgRent.toFixed(2)}</div></div>
      </div>

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<LeaseRow>
        rows={rows}
        columns={LEASE_COLUMNS}
        loading={loading}
        csvName="leases"
        onRowClick={(row) => console.log("open lease", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Collect rent", row)}>Collect rent</button>
            <button onClick={() => console.log("Send notice", row)}>Send notice</button>
          </>
        )}
      />
    </div>
  );
}

import React, { useMemo, useState } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { UNIT_COLUMNS, mapUnit } from "../columns";
import "../../../styles/table.css";

async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j = await r.json();
  return Array.isArray(j) ? j : j.data ?? [];
}

export default function PortfolioUnitsPage() {
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

  const rows: UnitRow[] = useMemo(() => raw.map(mapUnit), [raw]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const occupied = rows.filter((r) => String(r.status).toLowerCase() === "occupied").length;
    const vacant = rows.filter((r) => String(r.status).toLowerCase() === "vacant").length;
    const avgRent = rows.reduce((s, r) => s + (r.market_rent ?? 0), 0) / (rows.length || 1);
    return { total, occupied, vacant, avgRent };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">UNITS</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">OCCUPIED</div><div className="ecc-kpi-n">{kpi.occupied.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">VACANT</div><div className="ecc-kpi-n">{kpi.vacant.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">AVG MARKET RENT</div><div className="ecc-kpi-n">${kpi.avgRent.toFixed(2)}</div></div>
      </div>

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<UnitRow>
        rows={rows}
        columns={UNIT_COLUMNS}
        loading={loading}
        csvName="units"
        onRowClick={(row) => console.log("open unit", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Create work order", row)}>Create work order</button>
            <button onClick={() => console.log("View tenant", row)}>View tenant</button>
          </>
        )}
      />
    </div>
  );
}

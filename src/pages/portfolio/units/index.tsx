import React, { useMemo, useState } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { UNIT_COLUMNS, mapUnit } from "../columns";
import "../../../styles/table.css";

export default function UnitsPage() {
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");
  const leases = useCollection<any>("leases");

  const [minBd, setMinBd] = useState<number>(0);
  const [minBa, setMinBa] = useState<number>(0);

  const { rows, kpis, error, loading } = useMemo(() => {
    const pById = indexBy(props.data || [], "id");
    const activeLeaseUnits = new Set(
      (leases.data || [])
        .filter((l) => String(l.status).toLowerCase() === "active")
        .map((l) => String(l.unit_id))
    );

    const enriched = (units.data || []).map((u) => {
      const propName = pById.get(u.property_id)?.name || "—";
      const occupied = activeLeaseUnits.has(String(u.id));
      return mapUnit(u, propName, occupied);
    });

    const filtered = enriched.filter((r) => (r.beds || 0) >= minBd && (r.baths || 0) >= minBa);

    const kpis = {
      units: enriched.length,
      occupied: enriched.filter((r) => String(r.status).toLowerCase() === "occupied").length,
      vacant: enriched.filter((r) => String(r.status).toLowerCase() !== "occupied").length,
      avgMarket: (() => {
        const rents = enriched.map((r) => Number(r.market_rent || 0)).filter((n) => n > 0);
        return rents.length ? rents.reduce((a, b) => a + b, 0) / rents.length : 0;
      })(),
    };

    return {
      rows: filtered,
      kpis,
      loading: units.loading || props.loading || leases.loading,
      error: units.error || props.error || leases.error,
    };
  }, [units, props, leases, minBd, minBa]);

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

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
        const nums = enriched.map((r) => Number(r.rent || 0)).filter((n) => n > 0);
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
      })(),
    };

    return {
      rows: filtered,
      kpis,
      loading: units.loading || props.loading || leases.loading,
      error: units.error || props.error || leases.error,
    };
  }, [units, props, leases, minBd, minBa]);

  return (
    <div className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.units}</div><div className="ecc-kpi-l">UNITS</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.occupied}</div><div className="ecc-kpi-l">OCCUPIED</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.vacant}</div><div className="ecc-kpi-l">VACANT</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">${kpis.avgMarket.toFixed(2)}</div><div className="ecc-kpi-l">AVG MARKET RENT</div></div>
      </div>

      <DataTable
        rows={rows}
        columns={UNIT_COLUMNS}
        loading={loading}
        error={error}
        toolbar={
          <>
            <select className="ecc-select" value={minBd} onChange={(e) => setMinBd(Number(e.target.value))}>
              <option value={0}>Min Bd</option><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
            </select>
            <select className="ecc-select" value={minBa} onChange={(e) => setMinBa(Number(e.target.value))}>
              <option value={0}>Min Ba</option><option value={1}>1</option><option value={1.5}>1.5</option><option value={2}>2</option><option value={3}>3</option>
            </select>
          </>
        }
      />
    </div>
  );
}

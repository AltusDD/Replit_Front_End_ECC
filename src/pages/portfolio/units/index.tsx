import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { UNIT_COLUMNS, mapUnit } from "../columns";
import "../../../styles/table.css";

export default function UnitsPage() {
  const units = useCollection<any>("/api/portfolio/units");
  const props = useCollection<any>("/api/portfolio/properties");
  const leases = useCollection<any>("/api/portfolio/leases");

  const { rows, loading, error } = useMemo(() => {
    const pById = indexBy(props.data || [], "id");
    const activeLeaseUnits = new Set(
      (leases.data || [])
        .filter((l) => String(l.status).toLowerCase() === "active")
        .map((l) => String(l.unit_id))
    );

    const mapped = (units.data || []).map((u) => {
      const propName = pById.get(u.property_id)?.name || "—";
      const occupied = activeLeaseUnits.has(String(u.id));
      return mapUnit(u, propName, occupied);
    });

    return {
      rows: mapped,
      loading: units.loading || props.loading || leases.loading,
      error: units.error || props.error || leases.error,
    };
  }, [units, props, leases]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const occupied = rows.filter((r) => String(r.status).toLowerCase() === "occupied").length;
    const vacant = total - occupied;
    const avgRent = rows.length > 0 ? rows.reduce((s, r) => s + (Number(r.market_rent) || 0), 0) / rows.length : 0;
    return { total, occupied, vacant, avgRent };
  }, [rows]);

  return (
    <section className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.total}</div>
          <div className="ecc-kpi-l">Units</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.occupied}</div>
          <div className="ecc-kpi-l">Occupied</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.vacant}</div>
          <div className="ecc-kpi-l">Vacant</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">${kpis.avgRent.toFixed(0)}</div>
          <div className="ecc-kpi-l">Avg Market Rent</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={UNIT_COLUMNS}
        loading={loading}
        error={error}
        csvName="units"
        drawerTitle={(row) => `${row.property_name} - Unit ${row.unit_number}`}
      />
    </section>
  );
}

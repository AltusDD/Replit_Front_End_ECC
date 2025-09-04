import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { groupBy } from "../../../utils/dict";
import { normalizeId } from "../../../utils/ids";
import { PROPERTY_COLUMNS, mapProperty } from "../columns";
import "../../../styles/table.css";

export default function PropertiesPage() {
  const properties = useCollection<any>("/api/portfolio/properties");
  const units = useCollection<any>("/api/portfolio/units");
  const leases = useCollection<any>("/api/portfolio/leases");

  const { rows, loading, error } = useMemo(() => {
    const props = properties.data ?? [];
    const unitsArr = units.data ?? [];

    const unitsByProp = new Map<string, number>();
    const occByProp   = new Map<string, number>();

    for (const u of unitsArr) {
      const pid = normalizeId(u?.property_id ?? u?.propertyId ?? u?.property?.id);
      if (!pid) continue;
      const status = String(u?.status ?? "").toLowerCase();
      unitsByProp.set(pid, (unitsByProp.get(pid) ?? 0) + 1);
      if (status === "occupied" || status === "occ" || status === "active") {
        occByProp.set(pid, (occByProp.get(pid) ?? 0) + 1);
      }
    }

    const rows = (props || []).map((p: any) => {
      const pid = normalizeId(p?.id);
      const total = unitsByProp.get(pid) ?? 0;
      const occ   = occByProp.get(pid) ?? 0;
      const occPct = total > 0 ? Math.round((occ / total) * 100) : 0;
      // Keep your existing mapProperty(p) call; just override units/occPct:
      const base = mapProperty(p);
      return { ...base, units: total, occPct };
    });

    return {
      rows,
      loading: properties.loading || units.loading || leases.loading,
      error: properties.error || units.error || leases.error,
    };
  }, [properties, units, leases]);


  // KPIs: derive from rows (do NOT read units from API)
  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter(r => r.active).length;
    const totalUnitsKpi = rows.reduce((sum, r) => sum + (r.units ?? 0), 0);
    const avgOcc = total ? rows.reduce((s, r) => s + (r.occPct || 0), 0) / total : 0;
    return { total, active, totalUnits: totalUnitsKpi, avgOcc };
  }, [rows]);

  return (
    <section className="ecc-page">
      {/* Genesis KPI Strip */}
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.total}</div>
          <div className="ecc-kpi-l">Properties</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.totalUnits}</div>
          <div className="ecc-kpi-l">Total Units</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.active}</div>
          <div className="ecc-kpi-l">Active</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.avgOcc.toFixed(1)}%</div>
          <div className="ecc-kpi-l">Avg Occupancy</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={PROPERTY_COLUMNS}
        loading={loading}
        error={error}
        csvName="properties"
        drawerTitle={(row) => row.name || `Property ${row.id}`}
        rowHref={(row) => `/card/property/${row.id}`}
      />
    </section>
  );
}

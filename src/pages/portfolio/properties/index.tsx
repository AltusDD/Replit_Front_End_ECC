import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { PROPERTY_COLUMNS } from "../columns";
import "../../../styles/table.css";

export default function PropertiesPage() {
  const properties = useCollection<any>("/api/portfolio/properties");

  const { rows, loading, error } = useMemo(() => {
    // Backend now handles all relationships and calculations
    const data = properties.data ?? [];
    return {
      rows: data, // Use data directly from backend
      loading: properties.loading,
      error: properties.error,
    };
  }, [properties]);

  // KPIs: derive from backend-calculated rows
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

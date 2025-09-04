import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { groupBy } from "../../../utils/dict";
import { PROPERTY_COLUMNS, mapProperty } from "../columns";
import "../../../styles/table.css";

export default function PropertiesPage() {
  const props = useCollection<any>("/api/portfolio/properties");
  const units = useCollection<any>("/api/portfolio/units");
  const leases = useCollection<any>("/api/portfolio/leases");

  const { rows, loading, error } = useMemo(() => {
    const byPropUnits = groupBy(units.data || [], (u) => u.property_id);
    const activeLeases = (leases.data || []).filter((l) => String(l.status).toLowerCase() === "active");
    const byUnitActiveLease = new Set(activeLeases.map((l) => String(l.unit_id)));

    const mapped = (props.data || []).map((p) => {
      const u = byPropUnits.get(p.id) || [];
      const unitCount = p.unit_count ?? u.length ?? 0;
      const occCount = u.filter((x) => byUnitActiveLease.has(String(x.id))).length;
      const occPct = unitCount ? (occCount / unitCount) * 100 : 0;
      
      // Enrich property data with calculated values
      const enriched = {
        ...p,
        "units.total": unitCount,
        "units.occupied": occCount,
        occupancyPct: occPct
      };
      
      return mapProperty(enriched);
    });

    return {
      rows: mapped,
      loading: props.loading || units.loading || leases.loading,
      error: props.error || units.error || leases.error,
    };
  }, [props, units, leases]);

  // TEMPORARY DEBUG
  if (props.data && props.data.length) {
    console.debug("AUDIT/properties RAW", props.data[0]);
  }
  if (rows && rows.length) {
    console.debug("AUDIT/properties MAPPED", rows[0]);
  }

  // KPIs for display
  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter(r => r.active).length;
    const totalUnits = rows.reduce((s, r) => s + (r.units || 0), 0);
    const avgOcc = total ? rows.reduce((s, r) => s + (r.occPct || 0), 0) / total : 0;
    return { total, active, totalUnits, avgOcc };
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

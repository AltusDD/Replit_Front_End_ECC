import React, { useMemo, useState } from "react";
import { DataTable } from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { groupBy } from "../../../utils/dict";
import { PROPERTY_COLUMNS, mapProperty } from "../columns";

export default function PropertiesPage() {
  const props = useCollection<any>("properties");
  const units = useCollection<any>("units");
  const leases = useCollection<any>("leases");

  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { rows, kpis, error, loading } = useMemo(() => {
    const byPropUnits = groupBy(units.data || [], (u) => u.property_id);
    const activeLeases = (leases.data || []).filter((l) => String(l.status).toLowerCase() === "active");
    const byUnitActiveLease = new Set(activeLeases.map((l) => String(l.unit_id)));

    const derived = (props.data || []).map((p) => {
      const u = byPropUnits.get(p.id) || [];
      const unitCount = p.unit_count ?? u.length ?? 0;
      const occCount = u.filter((x) => byUnitActiveLease.has(String(x.id))).length;
      const occPct = unitCount ? (occCount / unitCount) * 100 : 0;
      return mapProperty(p, {
        city: p.address_city,
        state: p.address_state,
        units: unitCount,
        occ: occPct,
      });
    });

    const filtered = derived.filter((r) =>
      (stateFilter === "ALL" || r.state === stateFilter) &&
      (statusFilter === "ALL" || (statusFilter === "ACTIVE" ? r.active : !r.active))
    );

    const kpis = {
      properties: derived.length,
      units: units.data?.length || 0,
      activeProps: derived.filter((r) => r.active).length,
      occupancy: (() => {
        const totUnits = derived.reduce((s, r) => s + (r.unit_count || 0), 0);
        const occUnits = derived.reduce((s, r) => s + Math.round(((r.occupancy || 0) / 100) * (r.unit_count || 0)), 0);
        return totUnits ? (occUnits / totUnits) * 100 : 0;
      })(),
      states: Array.from(new Set(derived.map((r) => r.state).filter(Boolean))),
    };

    return {
      rows: filtered,
      kpis,
      error: props.error || units.error || leases.error,
      loading: props.loading || units.loading || leases.loading,
    };
  }, [props, units, leases, stateFilter, statusFilter]);

  return (
    <div className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.properties}</div><div className="ecc-kpi-l">PROPERTIES</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.units}</div><div className="ecc-kpi-l">UNITS</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.occupancy.toFixed(1)}%</div><div className="ecc-kpi-l">OCCUPANCY</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.activeProps}</div><div className="ecc-kpi-l">ACTIVE PROPS</div></div>
      </div>

      <DataTable
        rows={rows}
        columns={PROPERTY_COLUMNS}
        loading={loading}
        error={error}
        toolbar={
          <>
            <select className="ecc-select" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="ALL">All States</option>
              {kpis.states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="ecc-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </>
        }
      />
    </div>
  );
}

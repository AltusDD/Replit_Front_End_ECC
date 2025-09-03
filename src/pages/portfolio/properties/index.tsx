import React, { useMemo, useState } from "react";
import { DataTable, Col } from "../../../components/DataTable";
import KPIBar from "../../../components/KPIBar";
import { PROPERTY_COLUMNS } from "../columns";
import { useCollection } from "../../../features/data/useCollection";
import { groupBy } from "../../../utils/dict";
import { percent } from "../../../utils/format";
// Force recompile after fixing Map/Record issue

type Row = {
  id: any; doorloop_id?: any;
  name: string; type: string; class: string; state: string; city: string;
  unit_count: number; occupancy?: number; active: any;
};

export default function PropertiesPage() {
  const props = useCollection<any>("properties");
  const units = useCollection<any>("units");
  const leases = useCollection<any>("leases");

  const [stateF, setStateF] = useState<string>("ALL");
  const [activeF, setActiveF] = useState<"ALL"|"true"|"false">("ALL");

  const rawRows = useMemo<Row[]>(() => {
    const byPropUnits = groupBy(units.data, "property_id");
    const activeByUnit = new Set(
      (leases.data || []).filter(l => String(l?.status || "").toLowerCase() === "active").map(l => l.unit_id)
    );
    return (props.data || []).map((p: any) => {
      const u = byPropUnits.get(p.id) || [];
      const unit_count = p.unit_count ?? u.length ?? 0;
      const occUnitsStatus = u.filter((x:any) => String(x?.status||"").toLowerCase() === "occupied").length;
      const occUnitsLease = u.filter((x:any)=> activeByUnit.has(x.id)).length;
      const occUnits = Math.max(occUnitsStatus, occUnitsLease);
      const occPct = p.occupancy ?? p.occupancy_rate ?? (unit_count ? (occUnits / unit_count) * 100 : undefined);
      return {
        id: p.id ?? p.doorloop_id,
        doorloop_id: p.doorloop_id,
        name: p.name ?? "",
        type: p.type ?? p.category ?? "",
        class: p.class ?? p.asset_class ?? p.property_class ?? "",
        state: p.address_state ?? p.state ?? "",
        city: p.address_city ?? p.city ?? "",
        unit_count,
        occupancy: typeof occPct === "number" ? occPct : undefined,
        active: p.active ?? p.isActive ?? false,
      };
    });
  }, [props.data, units.data, leases.data]);

  const filtered = useMemo(() => {
    return rawRows.filter(r => {
      if (stateF !== "ALL" && r.state !== stateF) return false;
      if (activeF !== "ALL" && String(!!r.active) !== activeF) return false;
      return true;
    });
  }, [rawRows, stateF, activeF]);

  // KPIs
  const totals = useMemo(() => {
    const totalProps = filtered.length;
    const totalUnits = filtered.reduce((a,r)=> a + (r.unit_count || 0), 0);
    const occWeighted = filtered.reduce((a,r)=> a + ((r.occupancy ?? 0) * (r.unit_count || 0)), 0);
    const occ = totalUnits ? occWeighted / totalUnits : 0;
    const activeProps = filtered.filter(r => r.active).length;
    return { totalProps, totalUnits, occ, activeProps };
  }, [filtered]);

  const cols: Col<Row>[] = [
    { key: "name", header: "Property" },
    { key: "type", header: "Type" },
    { key: "class", header: "Class" },
    { key: "state", header: "State" },
    { key: "city", header: "City" },
    { key: "unit_count", header: "Units", align: "right", render: (r) => <span className="mono">{r.unit_count ?? "—"}</span> },
    { key: "occupancy", header: "Occ%", align: "right", render: (r) => <span className="mono">{r.occupancy == null ? "—" : percent(r.occupancy)}</span> },
    { key: "active", header: "Active", render: (r) => <span className={`badge ${r.active ? "ok" : "bad"}`}>{String(r.active)}</span> },
  ];

  const states = Array.from(new Set((rawRows || []).map(r => r.state).filter(Boolean))).sort();

  const filtersRight = (
    <>
      <select className="flt-select" value={stateF} onChange={(e)=>{ setStateF(e.target.value); }}>
        <option value="ALL">All States</option>
        {states.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="flt-select" value={activeF} onChange={(e)=>{ setActiveF(e.target.value as any); }}>
        <option value="ALL">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </>
  );

  return (
    <>
      <KPIBar items={[
        { label: "Properties", value: totals.totalProps },
        { label: "Units", value: totals.totalUnits },
        { label: "Occupancy", value: percent(totals.occ), tone: totals.occ >= 90 ? "ok" : totals.occ >= 80 ? "warn" : "bad" },
        { label: "Active Props", value: totals.activeProps },
      ]} />
      <DataTable
        title="Properties"
        columns={cols}
        rows={filtered}
        loading={props.loading}
        error={props.error ?? undefined}
        searchKeys={PROPERTY_COLUMNS.map(c => c.key as keyof Row & string)}
        defaultPageSize={50}
        pageSizeOptions={[25,50,100,200]}
        toolbarRight={filtersRight}
        csvFileName="properties.csv"
        rowKey={(r)=>r.id}
        emptyText="No properties"
      />
    </>
  );
}
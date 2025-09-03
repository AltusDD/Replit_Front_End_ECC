import React, { useMemo } from "react";
import { DataTable, Col } from "@/components/DataTable";
import { PROPERTY_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { groupBy } from "@/utils/dict";
import { percent } from "@/utils/format";

type Row = {
  id: any; doorloop_id?: any;
  name: string; type: string; class: string; state: string; city: string;
  unit_count: number; occupancy?: number | string; active: any;
};
export default function PropertiesPage() {
  const props = useCollection<any>("properties");
  const units = useCollection<any>("units");
  const leases = useCollection<any>("leases");

  const rows = useMemo<Row[]>(() => {
    const byPropUnits = groupBy(units.data, "property_id");
    const activeByUnit = new Set(
      leases.data.filter(l => String(l?.status || "").toLowerCase() === "active").map(l => l.unit_id)
    );
    return (props.data || []).map((p: any) => {
      const u = byPropUnits.get(p.id) || [];
      const unit_count = p.unit_count ?? u.length ?? 0;
      const occUnitsStatus = u.filter((x:any) => String(x?.status||"").toLowerCase() === "occupied").length;
      const occUnitsLease = u.filter((x:any)=> activeByUnit.has(x.id)).length;
      const occUnits = Math.max(occUnitsStatus, occUnitsLease);
      const occPct = p.occupancy ?? p.occupancy_rate ?? (unit_count ? (occUnits / unit_count) * 100 : null);
      return {
        id: p.id ?? p.doorloop_id,
        doorloop_id: p.doorloop_id,
        name: p.name ?? "",
        type: p.type ?? p.category ?? "",
        class: p.class ?? p.asset_class ?? p.property_class ?? "",
        state: p.address_state ?? p.state ?? "",
        city: p.address_city ?? p.city ?? "",
        unit_count,
        occupancy: occPct,
        active: p.active ?? p.isActive ?? false,
      };
    });
  }, [props.data, units.data, leases.data]);

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

  return (
    <DataTable
      title="Properties"
      columns={cols}
      rows={rows}
      loading={props.loading}
      error={props.error ?? undefined}
      searchKeys={PROPERTY_COLUMNS.map(c => c.key as keyof Row & string)}
      pageSize={50}
      rowKey={(r) => r.id}
      emptyText="No properties"
    />
  );
}
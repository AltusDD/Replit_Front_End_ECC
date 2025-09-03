import React, { useMemo } from "react";
import { SimpleTable } from "@/components/Table";
import { PROPERTY_COLUMNS, mapProperty } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { groupBy } from "@/utils/dict";

export default function PropertiesPage() {
  const props = useCollection<any>("properties");
  const units = useCollection<any>("units");
  const leases = useCollection<any>("leases");

  const rows = useMemo(() => {
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
        active: p.active ?? p.isActive ?? false,
        city: p.address_city ?? p.city ?? "",
        state: p.address_state ?? p.state ?? "",
        unit_count,
        occupancy: occPct == null ? "" : `${occPct.toFixed(1)}%`,
      };
    });
  }, [props.data, units.data, leases.data]);

  return (
    <>
      <h1>Properties</h1>
      {props.error && <div style={{ color: "tomato" }}>{String(props.error)}</div>}
      <SimpleTable
        columns={PROPERTY_COLUMNS}
        rows={rows.map(mapProperty)}
        empty={props.loading ? "Loading…" : "No properties"}
      />
    </>
  );
}
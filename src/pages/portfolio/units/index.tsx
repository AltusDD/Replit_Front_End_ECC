import React, { useMemo } from "react";
import { SimpleTable } from "@/components/Table";
import { UNIT_COLUMNS, mapUnit } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money } from "@/utils/dict";

export default function UnitsPage() {
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const rows = useMemo(() => {
    const pById = indexBy(props.data, "id");
    return (units.data || []).map((u: any) => ({
      id: u.id ?? u.doorloop_id,
      doorloop_id: u.doorloop_id,
      property: u.property ?? u.property_name ?? pById.get(u.property_id)?.name ?? "",
      unit_number: u.unit_number ?? u.number ?? u.name ?? "",
      beds: u.beds ?? u.bedrooms ?? "",
      baths: u.baths ?? u.bathrooms ?? "",
      sq_ft: u.sq_ft ?? u.sqft ?? "",
      status: u.status ?? (u.id && u.property_id ? "" : ""),
      market_rent: money(u.market_rent ?? u.rent ?? u.rent_amount ?? (typeof u.rent_cents === "number" ? u.rent_cents/100 : undefined)),
    }));
  }, [units.data, props.data]);

  return (
    <>
      <h1>Units</h1>
      {units.error && <div style={{ color: "tomato" }}>{String(units.error)}</div>}
      <SimpleTable
        columns={UNIT_COLUMNS}
        rows={rows.map(mapUnit)}
        empty={units.loading ? "Loading…" : "No units"}
      />
    </>
  );
}
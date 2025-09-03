import React, { useMemo } from "react";
import { DataTable, Col } from "@/components/DataTable";
import { UNIT_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money } from "@/utils/format";

type Row = {
  id:any; doorloop_id?:any; property:string; unit_number:string;
  beds:any; baths:any; sq_ft:any; status:any; market_rent:any;
};
export default function UnitsPage() {
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const rows = useMemo<Row[]>(() => {
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
      market_rent: typeof u.rent_cents === "number" ? u.rent_cents/100 : (u.market_rent ?? u.rent ?? u.rent_amount),
    }));
  }, [units.data, props.data]);

  const cols: Col<Row>[] = [
    { key: "property", header: "Property" },
    { key: "unit_number", header: "Unit" },
    { key: "beds", header: "Bd", align: "right" },
    { key: "baths", header: "Ba", align: "right" },
    { key: "sq_ft", header: "SqFt", align: "right" },
    { key: "status", header: "Status", render: (r) => <span className={`badge ${String(r.status).toLowerCase()==="occupied"?"ok":""}`}>{r.status || "—"}</span> },
    { key: "market_rent", header: "Market Rent", align: "right", render: (r)=> <span className="mono">{money(r.market_rent)}</span> },
  ];

  return (
    <DataTable
      title="Units"
      columns={cols}
      rows={rows}
      loading={units.loading}
      error={units.error ?? undefined}
      searchKeys={UNIT_COLUMNS.map(c => c.key as keyof Row & string)}
      pageSize={50}
      rowKey={(r)=>r.id}
      emptyText="No units"
    />
  );
}
import React, { useMemo } from "react";
import { DataTable, Col } from "@/components/DataTable";
import { LEASE_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money, shortDate } from "@/utils/format";

type Row = {
  id:any; doorloop_id?:any; tenant_names:string; property:string; rent:any; start:any; end:any; status:any;
};
export default function LeasesPage() {
  const leases = useCollection<any>("leases");
  const tenants = useCollection<any>("tenants");
  const props = useCollection<any>("properties");

  const rows = useMemo<Row[]>(() => {
    const tById = indexBy(tenants.data, "id");
    const pById = indexBy(props.data, "id");
    return (leases.data || []).map((l: any) => {
      const names =
        l.tenant_names ||
        tById.get(l.primary_tenant_id)?.display_name ||
        tById.get(l.tenant_id)?.display_name ||
        tById.get(l.primary_tenant_id)?.full_name ||
        tById.get(l.tenant_id)?.full_name || "";
      return {
        id: l.id ?? l.doorloop_id,
        doorloop_id: l.doorloop_id,
        tenant_names: names,
        property: l.property ?? pById.get(l.property_id)?.name ?? "",
        rent: typeof l.rent_cents === "number" ? l.rent_cents/100 : (l.rent ?? l.total_recurring_rent),
        start: l.start ?? l.start_date,
        end: l.end ?? l.end_date,
        status: l.status ?? "",
      };
    });
  }, [leases.data, tenants.data, props.data]);

  const cols: Col<Row>[] = [
    { key: "tenant_names", header: "Tenant(s)" },
    { key: "property", header: "Property" },
    { key: "rent", header: "Rent", align: "right", render: (r)=> <span className="mono">{money(r.rent)}</span> },
    { key: "start", header: "Start", render: (r)=> shortDate(r.start) },
    { key: "end", header: "End", render: (r)=> shortDate(r.end) },
    { key: "status", header: "Status", render: (r)=> <span className={`badge ${String(r.status).toLowerCase()==="active"?"ok":String(r.status).toLowerCase()==="ended"?"bad":"warn"}`}>{r.status || "—"}</span> },
  ];

  return (
    <DataTable
      title="Leases"
      columns={cols}
      rows={rows}
      loading={leases.loading}
      error={leases.error ?? undefined}
      searchKeys={LEASE_COLUMNS.map(c => c.key as keyof Row & string)}
      pageSize={50}
      rowKey={(r)=>r.id}
      emptyText="No leases"
    />
  );
}
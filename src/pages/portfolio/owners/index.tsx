import React, { useMemo } from "react";
import { DataTable, Col } from "@/components/DataTable";
import { OWNER_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

type Row = { id:any; doorloop_id?:any; name:string; email:string; phone:string; property_count:number; active:any };
export default function OwnersPage() {
  const owners = useCollection<any>("owners");

  const rows = useMemo<Row[]>(() => {
    return (owners.data || []).map((o:any) => ({
      id: o.id ?? o.doorloop_id,
      doorloop_id: o.doorloop_id,
      name: o.name ?? o.display_name ?? o.full_name ?? [o.first_name, o.last_name].filter(Boolean).join(" "),
      email: o.primary_email ?? o.email ?? "",
      phone: o.primary_phone ?? o.phone ?? "",
      property_count: o.property_count ?? 0,
      active: o.active ?? o.isActive ?? false,
    }));
  }, [owners.data]);

  const cols: Col<Row>[] = [
    { key: "name", header: "Owner" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "property_count", header: "Props", align: "right", render: (r)=> <span className="mono">{r.property_count ?? 0}</span> },
    { key: "active", header: "Active", render: (r)=> <span className={`badge ${r.active ? "ok":"bad"}`}>{String(r.active)}</span> },
  ];

  return (
    <DataTable
      title="Owners"
      columns={cols}
      rows={rows}
      loading={owners.loading}
      error={owners.error ?? undefined}
      searchKeys={OWNER_COLUMNS.map(c => c.key as keyof Row & string)}
      pageSize={50}
      rowKey={(r)=>r.id}
      emptyText="No owners"
    />
  );
}
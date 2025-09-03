import React, { useMemo, useState } from "react";
import { DataTable, Col } from "../../../components/DataTable";
import KPIBar from "../../../components/KPIBar";
import { OWNER_COLUMNS } from "../columns";
import { useCollection } from "../../../features/data/useCollection";

type Row = { id:any; doorloop_id?:any; name:string; email:string; phone:string; property_count:number; active:any };

export default function OwnersPage() {
  const owners = useCollection<any>("owners");
  const props  = useCollection<any>("properties");

  const [activeF, setActiveF] = useState<"ALL"|"true"|"false">("ALL");

  const rows = useMemo<Row[]>(() => {
    // Try several probable property owner fields
    function propertyCountForOwner(o:any) {
      const idMatch = (p:any) => p.owner_id===o.id || p.owners?.some?.((oid:any)=>oid===o.id);
      const nameMatch = (p:any) => {
        const s = [p.owner, p.owner_name, p.owner_display_name].filter(Boolean).join(" ").toLowerCase();
        const on = [o.name, o.display_name, o.full_name, `${o.first_name ?? ""} ${o.last_name ?? ""}`].filter(Boolean).join(" ").toLowerCase();
        return s && on && s.includes(on);
      };
      const candidates = (props.data || []).filter((p:any)=> idMatch(p) || nameMatch(p));
      return candidates.length || o.property_count || 0;
    }

    return (owners.data || []).map((o:any) => ({
      id: o.id ?? o.doorloop_id,
      doorloop_id: o.doorloop_id,
      name: o.name ?? o.display_name ?? o.full_name ?? [o.first_name, o.last_name].filter(Boolean).join(" "),
      email: o.primary_email ?? o.email ?? "",
      phone: o.primary_phone ?? o.phone ?? "",
      property_count: propertyCountForOwner(o),
      active: o.active ?? o.isActive ?? false,
    }));
  }, [owners.data, props.data]);

  const filtered = useMemo(() => rows.filter(r => activeF==="ALL" ? true : String(!!r.active)===activeF), [rows, activeF]);

  const totals = useMemo(() => {
    const count = filtered.length;
    const active = filtered.filter(r=>r.active).length;
    const propsSum = filtered.reduce((a,r)=>a+(r.property_count||0), 0);
    return { count, active, propsSum };
  }, [filtered]);

  const cols: Col<Row>[] = [
    { key: "name", header: "Owner" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "property_count", header: "Props", align: "right", render: (r)=> <span className="mono">{r.property_count ?? 0}</span> },
    { key: "active", header: "Active", render: (r)=> <span className={`badge ${r.active ? "ok":"bad"}`}>{String(r.active)}</span> },
  ];

  const filtersRight = (
    <select className="flt-select" value={activeF} onChange={(e)=>setActiveF(e.target.value as any)}>
      <option value="ALL">All Owners</option>
      <option value="true">Active</option>
      <option value="false">Inactive</option>
    </select>
  );

  return (
    <>
      <KPIBar items={[
        { label: "Owners", value: totals.count },
        { label: "Active", value: totals.active, tone: "ok" },
        { label: "Total Properties", value: totals.propsSum },
      ]}/>
      <DataTable
        title="Owners"
        columns={cols}
        rows={filtered}
        loading={owners.loading}
        error={owners.error ?? undefined}
        searchKeys={OWNER_COLUMNS.map(c => c.key as keyof Row & string)}
        defaultPageSize={50}
        pageSizeOptions={[25,50,100,200]}
        toolbarRight={filtersRight}
        csvFileName="owners.csv"
        rowKey={(r)=>r.id}
        emptyText="No owners"
      />
    </>
  );
}
import React, { useMemo, useState } from "react";
import { DataTable, Col } from "@/components/DataTable";
import KPIBar from "@/components/KPIBar";
import { TENANT_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money } from "@/utils/format";

type Row = { id:any; doorloop_id?:any; name:string; property:string; unit:string; email:string; phone:string; status:string; balance:any };

export default function TenantsPage() {
  const tenants = useCollection<any>("tenants");
  const leases = useCollection<any>("leases");
  const units  = useCollection<any>("units");
  const props  = useCollection<any>("properties");

  const [statusF, setStatusF] = useState<"ALL"|"LEASE_TENANT"|"PROSPECT_TENANT">("ALL");
  const [contactableOnly, setContactableOnly] = useState(false);

  const rows = useMemo<Row[]>(() => {
    const uById = indexBy(units.data, "id");
    const pById = indexBy(props.data, "id");
    const latest = new Map<any, any>();
    for (const l of leases.data || []) {
      const tids = [l.primary_tenant_id, l.tenant_id].filter(Boolean);
      for (const tid of tids) {
        const cur = latest.get(tid);
        const score = Date.parse(l.updated_at || l.start_date || "") || 0;
        const curScore = cur ? (Date.parse(cur.updated_at || cur.start_date || "") || 0) : -1;
        if (!cur || score >= curScore) latest.set(tid, l);
      }
    }
    return (tenants.data || []).map((t: any) => {
      const l = latest.get(t.id);
      const u = l ? uById.get(l.unit_id) : undefined;
      const p = u ? pById.get(u.property_id) : (l ? pById.get(l.property_id) : undefined);
      const name =
        t.name || t.display_name || t.full_name || [t.first_name, t.last_name].filter(Boolean).join(" ");
      return {
        id: t.id ?? t.doorloop_id,
        doorloop_id: t.doorloop_id,
        name,
        property: p?.name ?? "",
        unit: u?.unit_number ?? u?.number ?? u?.name ?? "",
        email: t.primary_email ?? t.email ?? "",
        phone: t.primary_phone ?? t.phone ?? "",
        status: (l?.status ?? t.status ?? t.type ?? "").toString(),
        balance: t.balance,
      };
    });
  }, [tenants.data, leases.data, units.data, props.data]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (statusF !== "ALL" && r.status !== statusF) return false;
      if (contactableOnly && !(r.email || r.phone)) return false;
      return true;
    });
  }, [rows, statusF, contactableOnly]);

  const totals = useMemo(() => {
    const count = filtered.length;
    const contactable = filtered.filter(r => r.email || r.phone).length;
    const leaseTenants = filtered.filter(r => r.status === "LEASE_TENANT").length;
    const prospects = filtered.filter(r => r.status === "PROSPECT_TENANT").length;
    return { count, contactable, leaseTenants, prospects };
  }, [filtered]);

  const cols: Col<Row>[] = [
    { key: "name", header: "Name" },
    { key: "property", header: "Property" },
    { key: "unit", header: "Unit" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "status", header: "Status", render: (r)=> <span className={`badge ${r.status==="LEASE_TENANT"?"ok":""}`}>{r.status || "—"}</span> },
    { key: "balance", header: "Balance", align: "right", render: (r)=> <span className="mono">{money(r.balance)}</span> },
  ];

  const filtersRight = (
    <>
      <select className="flt-select" value={statusF} onChange={(e)=>setStatusF(e.target.value as any)}>
        <option value="ALL">All</option>
        <option value="LEASE_TENANT">LEASE_TENANT</option>
        <option value="PROSPECT_TENANT">PROSPECT_TENANT</option>
      </select>
      <label className="flt-check" style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
        <input type="checkbox" checked={contactableOnly} onChange={(e)=>setContactableOnly(e.target.checked)} />
        Contactable only
      </label>
    </>
  );

  return (
    <>
      <KPIBar items={[
        { label: "Tenants", value: totals.count },
        { label: "Contactable", value: totals.contactable },
        { label: "Lease Tenants", value: totals.leaseTenants, tone: "ok" },
        { label: "Prospects", value: totals.prospects, tone: "warn" },
      ]}/>
      <DataTable
        title="Tenants"
        columns={cols}
        rows={filtered}
        loading={tenants.loading}
        error={tenants.error ?? undefined}
        searchKeys={TENANT_COLUMNS.map(c => c.key as keyof Row & string)}
        defaultPageSize={50}
        pageSizeOptions={[25,50,100,200]}
        toolbarRight={filtersRight}
        csvFileName="tenants.csv"
        rowKey={(r)=>r.id}
        emptyText="No tenants"
      />
    </>
  );
}
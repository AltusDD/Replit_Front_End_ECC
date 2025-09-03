import React, { useMemo, useState } from "react";
import { DataTable, Col } from "../../../components/DataTable";
import KPIBar from "../../../components/KPIBar";
import { LEASE_COLUMNS } from "../columns";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { money, shortDate } from "../../../utils/format";

type Row = { id:any; doorloop_id?:any; tenant_names:string; property:string; rent:number|undefined; start:any; end:any; status:string };

export default function LeasesPage() {
  const leases = useCollection<any>("leases");
  const tenants = useCollection<any>("tenants");
  const props = useCollection<any>("properties");

  const [statusF, setStatusF] = useState<"ALL"|"active"|"ended">("ALL");

  const rawRows = useMemo<Row[]>(() => {
    const tById = indexBy(tenants.data, "id");
    const pById = indexBy(props.data, "id");
    return (leases.data || []).map((l: any) => {
      const names =
        l.tenant_names ||
        tById.get(l.primary_tenant_id)?.display_name ||
        tById.get(l.tenant_id)?.display_name ||
        tById.get(l.primary_tenant_id)?.full_name ||
        tById.get(l.tenant_id)?.full_name || "";
      const rent = typeof l.rent_cents === "number" ? l.rent_cents/100 : (l.rent ?? l.total_recurring_rent);
      return {
        id: l.id ?? l.doorloop_id,
        doorloop_id: l.doorloop_id,
        tenant_names: names,
        property: l.property ?? pById.get(l.property_id)?.name ?? "",
        rent: typeof rent === "number" ? rent : undefined,
        start: l.start ?? l.start_date,
        end: l.end ?? l.end_date,
        status: (l.status ?? "").toLowerCase(),
      };
    });
  }, [leases.data, tenants.data, props.data]);

  const filtered = useMemo(() => {
    return rawRows.filter(r => statusF==="ALL" ? true : r.status === statusF);
  }, [rawRows, statusF]);

  const totals = useMemo(() => {
    const active = filtered.filter(r=>r.status==="active");
    const ended = filtered.filter(r=>r.status==="ended");
    const mrr = active.reduce((a,r)=> a + (r.rent || 0), 0);
    const avgRent = active.length ? mrr / active.length : 0;
    return { count: filtered.length, active: active.length, ended: ended.length, mrr, avgRent };
  }, [filtered]);

  const cols: Col<Row>[] = [
    { key: "tenant_names", header: "Tenant(s)" },
    { key: "property", header: "Property" },
    { key: "rent", header: "Rent", align: "right", render: (r)=> <span className="mono">{money(r.rent)}</span> },
    { key: "start", header: "Start", render: (r)=> shortDate(r.start) },
    { key: "end", header: "End", render: (r)=> shortDate(r.end) },
    { key: "status", header: "Status", render: (r)=> <span className={`badge ${r.status==="active"?"ok":r.status==="ended"?"bad":"warn"}`}>{r.status || "—"}</span> },
  ];

  const filtersRight = (
    <select className="flt-select" value={statusF} onChange={(e)=>setStatusF(e.target.value as any)}>
      <option value="ALL">All</option>
      <option value="active">active</option>
      <option value="ended">ended</option>
    </select>
  );

  return (
    <>
      <KPIBar items={[
        { label: "Leases", value: totals.count },
        { label: "Active", value: totals.active, tone: "ok" },
        { label: "Ended", value: totals.ended, tone: totals.ended ? "warn" : "ok" },
        { label: "MRR", value: money(totals.mrr) },
        { label: "Avg Rent", value: money(totals.avgRent) },
      ]}/>
      <DataTable
        title="Leases"
        columns={cols}
        rows={filtered}
        loading={leases.loading}
        error={leases.error ?? undefined}
        searchKeys={LEASE_COLUMNS.map(c => c.key as keyof Row & string)}
        defaultPageSize={50}
        pageSizeOptions={[25,50,100,200]}
        toolbarRight={filtersRight}
        csvFileName="leases.csv"
        rowKey={(r)=>r.id}
        emptyText="No leases"
      />
    </>
  );
}
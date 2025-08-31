import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { label:"id", key:"id", width:110, render:(r:any)=> (r.id ? String(r.id).slice(0,8) : "—"), sortKey:(r:any)=> r.id },
  { label:"tenant", width:220, render:(r:any)=> r.tenant_name || r.tenant?.full_name || r.primary_tenant || "—", sortKey:(r:any)=> r.tenant_name || r.tenant?.full_name || r.primary_tenant },
  { label:"property", width:240, render:(r:any)=> r.property_display_name || r.property_name || r.property?.name || "—", sortKey:(r:any)=> r.property_display_name || r.property_name || r.property?.name },
  { label:"rent", width:120, render:(r:any)=> r.monthly_rent ?? r.rent ?? r.scheduled_rent ?? "—", sortKey:(r:any)=> Number(r.monthly_rent ?? r.rent ?? r.scheduled_rent) },
  { label:"start", key:"start_date", width:120 },
  { label:"end", key:"end_date", width:120 },
  { label:"status", width:120, render:(r:any)=> r.status || r.phase || r.lease_status || "—", sortKey:(r:any)=> r.status || r.phase || r.lease_status },
];

export default function Leases(){
  const { data, loading, error } = useCollection("leases", { limit: 500, order: "updated_at.desc" });
  return (
    <>
      <h1 className="pageTitle">Leases</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} leases`}
        empty={loading ? "Loading…" : "No results"}
      />
    </>
  );
}

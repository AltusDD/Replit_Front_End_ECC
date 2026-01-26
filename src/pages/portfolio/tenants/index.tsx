import Table from "../../../components/ui/Table";
import { useCollection } from "../../../lib/useApi";

const cols = [
  { label:"id", key:"id", width:110, render:(r:any)=> (r.id ? String(r.id).slice(0,8) : "—"), sortKey:(r:any)=> r.id },
  { label:"name", width:220, render:(r:any)=> r.full_name || r.name || `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—", sortKey:(r:any)=> r.full_name || r.name || `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() },
  { label:"email", width:260, key:"email" },
  { label:"phone", width:160, key:"phone" },
  { label:"status", width:120, render:(r:any)=> r.status || r.tenant_status || "—", sortKey:(r:any)=> r.status || r.tenant_status },
  { label:"balance", width:120, render:(r:any)=> r.balance_due ?? r.balance ?? "—", sortKey:(r:any)=> Number(r.balance_due ?? r.balance) },
];

export default function Tenants(){
  const { data, loading, error } = useCollection("tenants", { limit: 500, order: "updated_at.desc" });
  return (
    <>
      <h1 className="pageTitle">Tenants</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} tenants`}
        empty={loading ? "Loading…" : "No results"}
      />
    </>
  );
}

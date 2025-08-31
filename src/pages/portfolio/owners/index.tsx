import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { label:"id", key:"id", width:110, render:(r:any)=> (r.id ? String(r.id).slice(0,8) : "—"), sortKey:(r:any)=> r.id },
  { label:"name", width:260, render:(r:any)=> r.full_name || r.company_name || r.name || "—", sortKey:(r:any)=> r.full_name || r.company_name || r.name },
  { label:"email", width:260, key:"email" },
  { label:"phone", width:160, key:"phone" },
  { label:"# properties", width:130, render:(r:any)=> r.properties_count ?? r.property_count ?? r.prop_count ?? "—", sortKey:(r:any)=> Number(r.properties_count ?? r.property_count ?? r.prop_count) },
  { label:"status", width:120, render:(r:any)=> r.status || "—", sortKey:(r:any)=> r.status },
];

export default function Owners(){
  const { data, loading, error } = useCollection("owners", { limit: 500, order: "updated_at.desc" });
  return (
    <>
      <h1 className="pageTitle">Owners</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} owners`}
        empty={loading ? "Loading…" : "No results"}
      />
    </>
  );
}

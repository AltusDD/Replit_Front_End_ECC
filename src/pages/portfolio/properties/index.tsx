import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { label: "id", key: "id", width: 110, render: (r:any)=> (r.id ? String(r.id).slice(0,8) : "—"), sortKey:(r:any)=> r.id },
  { label: "doorloop_id", key: "doorloop_id", width: 130 },
  { label: "name", width: 280, render: (r:any)=> r.display_name || r.name || r.property_name || r.address_street1 || "—", sortKey:(r:any)=> r.display_name || r.name || r.property_name || r.address_street1 },
  { label: "type", key: "type", width: 220 },
  { label: "class", key: "class", width: 140 },
  { label: "active", key: "active", width: 80, render:(r:any)=> r.active ? "true" : "false", sortKey:(r:any)=> !!r.active },
  { label: "address_street1", key: "address_street1", width: 320 },
];

export default function Properties(){
  const { data, loading, error } = useCollection("properties", { limit: 500, order: "updated_at.desc" });
  return (
    <>
      <h1 className="pageTitle">Properties</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} properties`}
        empty={loading ? "Loading…" : "No results"}
      />
    </>
  );
}

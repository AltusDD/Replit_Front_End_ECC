import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { label:"id", key:"id", width:110, render:(r:any)=> (r.id ? String(r.id).slice(0,8) : "—"), sortKey:(r:any)=> r.id },
  { label:"property", width:240, render:(r:any)=> r.property_display_name || r.property_name || r.property?.name || "—", sortKey:(r:any)=> r.property_display_name || r.property_name || r.property?.name },
  { label:"unit", width:120, render:(r:any)=> r.display_name || r.unit_number || r.name || "—", sortKey:(r:any)=> r.display_name || r.unit_number || r.name },
  { label:"beds", width:70, key:"bedrooms", sortKey:(r:any)=> Number(r.bedrooms) },
  { label:"baths", width:70, key:"bathrooms", sortKey:(r:any)=> Number(r.bathrooms) },
  { label:"market_rent", width:120, key:"market_rent", render:(r:any)=> r.market_rent ?? r.rent ?? "—", sortKey:(r:any)=> Number(r.market_rent ?? r.rent) },
  { label:"status", width:140, render:(r:any)=> r.status || r.occupancy_status || r.unit_status || "—", sortKey:(r:any)=> r.status || r.occupancy_status || r.unit_status },
];

export default function Units(){
  const { data, loading, error } = useCollection("units", { limit: 500, order: "updated_at.desc" });
  return (
    <>
      <h1 className="pageTitle">Units</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} units`}
        empty={loading ? "Loading…" : "No results"}
      />
    </>
  );
}

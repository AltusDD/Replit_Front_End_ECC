import { useCollection } from "@lib/useApi";
import Table from "@/components/ui/Table";

export default function Properties(){
  const {data, loading, error} = useCollection("properties");
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'address_city', label: 'City' },
    { key: 'address_state', label: 'State' },
    { key: 'updated_at', label: 'Updated', render: (row:any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '' }
  ];

  return (
    <>
      <h1 className="pageTitle">Properties</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      {!loading && <div style={{marginBottom:12}}>Loaded {data.length} properties</div>}
      <Table 
        rows={data} 
        cols={columns} 
        empty={loading ? "Loading…" : "No properties found"}
      />
    </>
  )
}

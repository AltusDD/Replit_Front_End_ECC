import { useCollection } from "@lib/useApi";
import Table from "@/components/ui/Table";

export default function Tenants(){
  const {data, loading, error} = useCollection("tenants");
  
  const columns = [
    { key: 'display_name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'email', label: 'Email' },
    { key: 'updated_at', label: 'Updated', render: (row:any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '' }
  ];

  return (
    <>
      <h1 className="pageTitle">Tenants</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      {!loading && <div style={{marginBottom:12}}>Loaded {data.length} tenants</div>}
      <Table 
        rows={data} 
        cols={columns} 
        empty={loading ? "Loading…" : "No tenants found"}
      />
    </>
  )
}

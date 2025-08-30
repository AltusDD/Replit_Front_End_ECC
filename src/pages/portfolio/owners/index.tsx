import { useCollection } from "@lib/useApi";
import Table from "@/components/ui/Table";

export default function Owners(){
  const {data, loading, error} = useCollection("owners");
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'updated_at', label: 'Updated', render: (row:any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '' }
  ];

  return (
    <>
      <h1 className="pageTitle">Owners</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      {!loading && <div style={{marginBottom:12}}>Loaded {data.length} owners</div>}
      <Table 
        rows={data} 
        cols={columns} 
        empty={loading ? "Loading…" : "No owners found"}
      />
    </>
  )
}

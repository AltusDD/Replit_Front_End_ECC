import { useCollection } from "@lib/useApi";
import Table from "@/components/ui/Table";

export default function Leases(){
  const {data, loading, error} = useCollection("leases");
  
  const columns = [
    { key: 'property_id', label: 'Property ID' },
    { key: 'unit_id', label: 'Unit ID' },
    { key: 'rent_cents', label: 'Rent', render: (row:any) => row.rent_cents ? `$${(row.rent_cents/100).toFixed(2)}` : '' },
    { key: 'status', label: 'Status' },
    { key: 'updated_at', label: 'Updated', render: (row:any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '' }
  ];

  return (
    <>
      <h1 className="pageTitle">Leases</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      {!loading && <div style={{marginBottom:12}}>Loaded {data.length} leases</div>}
      <Table 
        rows={data} 
        cols={columns} 
        empty={loading ? "Loading…" : "No leases found"}
      />
    </>
  )
}

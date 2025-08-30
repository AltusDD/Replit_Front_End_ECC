import { useCollection } from "@lib/useApi";
import Table from "@/components/ui/Table";

export default function Leases(){
  const {data, loading, error} = useCollection("leases");
  
  const columns = [
    { key: 'tenant_name', label: 'Name' },
    { key: 'unit_number', label: 'Unit' },
    { key: 'rent_amount', label: 'Rent', render: (row:any) => row.rent_amount ? `$${row.rent_amount}` : '' },
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

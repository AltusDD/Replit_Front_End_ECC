import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'unit_number', label: 'Name' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Baths' },
  { key: 'sq_ft', label: 'Sq Ft' },
  { key: 'rent_amount', label: 'Rent', render: (r:any) => r.rent_amount ? `$${r.rent_amount}` : 'N/A' },
  { key: 'status', label: 'Status', render: (r:any) => <span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span> },
  { key: 'lease_end_date', label: 'Lease Ends', render: (r:any) => r.lease_end_date ? new Date(r.lease_end_date).toLocaleDateString() : 'N/A' },
  { key: 'tenant_name', label: 'Tenant', render: (r:any) => r.tenant_name || 'Vacant' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Units(){
  const {data, loading, error} = useCollection("units", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Units</h1>
      {error && <div className="panel" style={{ padding:12, marginBottom:12 }}>API error: {String(error.message || error)}</div>}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} units`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
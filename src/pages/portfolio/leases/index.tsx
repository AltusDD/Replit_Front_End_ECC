import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'id', label: 'Lease ID' },
  { key: 'property_id', label: 'Property ID' },
  { key: 'unit_id', label: 'Unit ID' },
  { key: 'tenant_name', label: 'Tenant', render: (r:any) => r.tenant_name || r.primary_tenant_id || 'N/A' },
  { key: 'start_date', label: 'Start Date', render: (r:any) => r.start_date ? new Date(r.start_date).toLocaleDateString() : 'N/A' },
  { key: 'end_date', label: 'End Date', render: (r:any) => r.end_date ? new Date(r.end_date).toLocaleDateString() : 'N/A' },
  { key: 'rent_cents', label: 'Rent', render: (r:any) => r.rent_cents ? `$${(r.rent_cents/100).toFixed(2)}` : 'N/A' },
  { key: 'total_balance_due', label: 'Balance Due', render: (r:any) => r.total_balance_due ? `$${r.total_balance_due}` : '$0.00' },
  { key: 'status', label: 'Status' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Leases(){
  const {data, loading, error} = useCollection("leases", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Leases</h1>
      {error && <div className="panel" style={{ padding:12, marginBottom:12 }}>API error: {String(error.message || error)}</div>}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} leases`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
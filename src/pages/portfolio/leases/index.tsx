import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'id', label: 'Lease ID', sortable: true, filterable: true },
  { key: 'property_id', label: 'Property ID', sortable: true, filterable: true },
  { key: 'unit_id', label: 'Unit ID', sortable: true, filterable: true },
  { key: 'tenant_name', label: 'Tenant', sortable: true, filterable: true, render: (r:any) => r.tenant_name || r.primary_tenant_id || 'N/A' },
  { key: 'start_date', label: 'Start Date', sortable: true, render: (r:any) => r.start_date ? new Date(r.start_date).toLocaleDateString() : 'N/A' },
  { key: 'end_date', label: 'End Date', sortable: true, render: (r:any) => r.end_date ? new Date(r.end_date).toLocaleDateString() : 'N/A' },
  { key: 'rent_cents', label: 'Rent', sortable: true, render: (r:any) => r.rent_cents ? `$${(r.rent_cents/100).toFixed(2)}` : 'N/A' },
  { key: 'total_balance_due', label: 'Balance Due', sortable: true, render: (r:any) => {
    const amount = r.total_balance_due || 0;
    const color = amount > 0 ? 'var(--danger)' : 'var(--success)';
    return <span style={{color}}>${amount.toFixed(2)}</span>;
  }},
  { key: 'status', label: 'Status', sortable: true, filterable: true, render: (r:any) => <span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span> },
  { key: 'updated_at', label: 'Updated', sortable: true, render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
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
        cap={`${data.length} leases loaded`}
        empty={loading ? 'Loading…' : 'No leases found'}
        entityType="lease"
        pageSize={25}
      />
    </>
  );
}
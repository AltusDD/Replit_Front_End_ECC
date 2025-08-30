import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'id', label: 'Lease ID' },
  { key: 'property_id', label: 'Property ID' },
  { key: 'unit_id', label: 'Unit ID' },
  { key: 'primary_tenant_id', label: 'Tenant ID' },
  { key: 'start_date', label: 'Start Date', render: (r:any) => r.start_date ? new Date(r.start_date).toLocaleDateString() : '' },
  { key: 'end_date', label: 'End Date', render: (r:any) => r.end_date ? new Date(r.end_date).toLocaleDateString() : '' },
  { key: 'rent_cents', label: 'Rent', render: (r:any) => r.rent_cents ? `$${(r.rent_cents/100).toFixed(2)}` : 'N/A' },
  { key: 'status', label: 'Status' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Leases(){
  const {data, loading, error} = useCollection("leases", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Leases</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} leases`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
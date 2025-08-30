import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'unit_number', label: 'Unit', sortable: true, filterable: true },
  { key: 'beds', label: 'Beds', sortable: true, filterable: true },
  { key: 'baths', label: 'Baths', sortable: true, filterable: true },
  { key: 'sq_ft', label: 'Sq Ft', sortable: true, render: (r:any) => r.sq_ft ? `${r.sq_ft}` : 'N/A' },
  { key: 'rent_amount', label: 'Rent', sortable: true, render: (r:any) => r.rent_amount ? `$${r.rent_amount}` : 'N/A' },
  { key: 'status', label: 'Status', sortable: true, filterable: true, render: (r:any) => <span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span> },
  { key: 'lease_end_date', label: 'Lease Ends', sortable: true, render: (r:any) => r.lease_end_date ? new Date(r.lease_end_date).toLocaleDateString() : 'N/A' },
  { key: 'tenant_name', label: 'Tenant', sortable: true, filterable: true, render: (r:any) => r.tenant_name || <span className="badge vacant">Vacant</span> },
  { key: 'updated_at', label: 'Updated', sortable: true, render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
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
        cap={`${data.length} units loaded`}
        empty={loading ? 'Loading…' : 'No units found'}
        entityType="unit"
        pageSize={25}
      />
    </>
  );
}
import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'property_id', label: 'Property ID' },
  { key: 'unit_id', label: 'Unit ID' },
  { key: 'rent_cents', label: 'Rent', render: (r:any) => r.rent_cents ? `$${(r.rent_cents/100).toFixed(2)}` : '' },
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
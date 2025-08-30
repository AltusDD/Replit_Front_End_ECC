import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'unit_number', label: 'Unit' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Baths' },
  { key: 'sq_ft', label: 'Sq Ft' },
  { key: 'rent_amount', label: 'Rent', render: (r:any) => r.rent_amount ? `$${r.rent_amount}` : 'N/A' },
  { key: 'status', label: 'Status' },
  { key: 'property_id', label: 'Property ID' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Units(){
  const {data, loading, error} = useCollection("units", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Units</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} units`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
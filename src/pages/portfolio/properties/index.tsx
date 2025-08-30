import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'name', label: 'Name' },
  { key: 'address_city', label: 'City' },
  { key: 'address_state', label: 'State' },
  { key: 'unit_count', label: 'Units' },
  { key: 'occupancy_rate', label: 'Occupancy', render: (r:any) => r.occupancy_rate ? `${r.occupancy_rate}%` : 'N/A' },
  { key: 'open_work_orders', label: 'Work Orders', render: (r:any) => r.open_work_orders || '0' },
  { key: 'health_score', label: 'Health Score', render: (r:any) => r.health_score ? <strong>{r.health_score}</strong> : 'N/A' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Properties(){
  const {data, loading, error} = useCollection("properties", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Properties</h1>
      {error && <div className="panel" style={{ padding:12, marginBottom:12 }}>API error: {String(error.message || error)}</div>}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`Loaded ${data.length} properties`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'address_city', label: 'City', sortable: true, filterable: true },
  { key: 'address_state', label: 'State', sortable: true, filterable: true },
  { key: 'type', label: 'Type', sortable: true, filterable: true },
  { key: 'unit_count', label: 'Units', sortable: true, render: (r:any) => r.unit_count || '0' },
  { key: 'occupancy_rate', label: 'Occupancy', sortable: true, render: (r:any) => r.occupancy_rate ? `${r.occupancy_rate}%` : 'N/A' },
  { key: 'active', label: 'Active', sortable: true, filterable: true, render: (r:any) => <span className={`badge ${r.active ? 'active' : 'inactive'}`}>{r.active ? 'Yes' : 'No'}</span> },
  { key: 'health_score', label: 'Health Score', sortable: true, render: (r:any) => r.health_score ? <strong style={{color: r.health_score >= 80 ? 'var(--success)' : r.health_score >= 60 ? 'var(--warn)' : 'var(--danger)'}}>{r.health_score}</strong> : 'N/A' },
  { key: 'updated_at', label: 'Updated', sortable: true, render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
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
        cap={`${data.length} properties loaded`}
        empty={loading ? 'Loading…' : 'No properties found'}
        entityType="property"
        pageSize={25}
      />
    </>
  );
}
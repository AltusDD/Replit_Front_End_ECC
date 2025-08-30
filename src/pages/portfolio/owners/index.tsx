import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'display_name', label: 'Name', sortable: true, filterable: true },
  { key: 'company_name', label: 'Company', sortable: true, filterable: true },
  { key: 'first_name', label: 'First Name', sortable: true, filterable: true },
  { key: 'last_name', label: 'Last Name', sortable: true, filterable: true },
  { key: 'notes', label: 'Contact Info', filterable: true },
  { key: 'active', label: 'Active', sortable: true, filterable: true, render: (r:any) => <span className={`badge ${r.active ? 'active' : 'inactive'}`}>{r.active ? 'Yes' : 'No'}</span> },
  { key: 'management_start_date', label: 'Management Start', sortable: true, render: (r:any) => r.management_start_date ? new Date(r.management_start_date).toLocaleDateString() : 'N/A' },
  { key: 'updated_at', label: 'Updated', sortable: true, render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Owners(){
  const {data, loading, error} = useCollection("owners", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Owners</h1>
      {error && <div className="panel" style={{ padding:12, marginBottom:12 }}>API error: {String(error.message || error)}</div>}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`${data.length} owners loaded`}
        empty={loading ? 'Loading…' : 'No owners found'}
        entityType="owner"
        pageSize={25}
      />
    </>
  );
}
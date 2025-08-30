import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'display_name', label: 'Name' },
  { key: 'company_name', label: 'Company' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'notes', label: 'Contact Info' },
  { key: 'active', label: 'Active', render: (r:any) => r.active ? 'Yes' : 'No' },
  { key: 'management_start_date', label: 'Management Start', render: (r:any) => r.management_start_date ? new Date(r.management_start_date).toLocaleDateString() : 'N/A' },
  { key: 'updated_at', label: 'Updated', render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
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
        cap={`Loaded ${data.length} owners`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
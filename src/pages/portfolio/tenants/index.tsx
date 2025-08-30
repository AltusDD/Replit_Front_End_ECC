import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  { key: 'display_name', label: 'Name', sortable: true, filterable: true },
  { key: 'first_name', label: 'First Name', sortable: true, filterable: true },
  { key: 'last_name', label: 'Last Name', sortable: true, filterable: true },
  { key: 'type', label: 'Type', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'company_name', label: 'Company', sortable: true, filterable: true },
  { key: 'credit_score', label: 'Credit Score', sortable: true, render: (r:any) => {
    const score = r.credit_score;
    if (!score) return 'N/A';
    const color = score >= 700 ? 'var(--success)' : score >= 600 ? 'var(--warn)' : 'var(--danger)';
    return <span style={{color}}>{score}</span>;
  }},
  { key: 'total_balance_due', label: 'Balance Due', sortable: true, render: (r:any) => {
    const amount = r.total_balance_due || 0;
    const color = amount > 0 ? 'var(--danger)' : 'var(--success)';
    return <span style={{color}}>${amount.toFixed(2)}</span>;
  }},
  { key: 'updated_at', label: 'Updated', sortable: true, render: (r:any) => r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }
];

export default function Tenants(){
  const {data, loading, error} = useCollection("tenants", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">Tenants</h1>
      {error && <div className="panel" style={{ padding:12, marginBottom:12 }}>API error: {String(error.message || error)}</div>}
      <Table
        rows={loading ? [] : data}
        cols={cols}
        cap={`${data.length} tenants loaded`}
        empty={loading ? 'Loading…' : 'No tenants found'}
        entityType="tenant"
        pageSize={25}
      />
    </>
  );
}
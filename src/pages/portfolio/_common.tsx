import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@/lib/useApi';

function getName(row:any){
  return row.display_name ?? row.name ?? row.property_name ?? row.full_name ?? row.company_name ?? row.address1 ?? '(unnamed)';
}
function getCity(row:any){
  return row.city ?? row.property_city ?? row.mailing_city ?? '';
}
function getState(row:any){
  return row.state ?? row.property_state ?? row.mailing_state ?? '';
}
function getUpdated(row:any){
  return row.updated_at ?? row.updatedAt ?? row.modified_at ?? row.modifiedAt ?? '';
}

export function PageFor({ entity }: { entity: string }): React.ReactElement {
  const { data, loading, error } = useCollection<any>(entity, { order: 'updated_at.desc', limit: 200 });

  const rows = (data||[]).map((r:any)=>({
    ...r,
    __name: getName(r),
    __city: getCity(r),
    __state: getState(r),
    __updated: getUpdated(r)
  }));

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1 style={{ textTransform:'capitalize' }}>{entity}</h1>
      <div style={{ color:'var(--muted)' }}>
        {loading ? 'Loading…' : error ? String(error) : `Loaded ${rows.length} ${entity}.`}
      </div>
      <Table
        columns={[
          { key:'__name', label:'Name' },
          { key:'__city', label:'City' },
          { key:'__state', label:'State', width: 80 },
          { key:'__updated', label:'Updated' }
        ]}
        rows={rows}
      />
    </div>
  );
}
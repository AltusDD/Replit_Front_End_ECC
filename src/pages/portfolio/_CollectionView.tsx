import React from 'react';
import Table from '@/components/ui/Table';
import { useAsync } from '@lib/useApi';
import { fetchCollection } from '@lib/ecc-api';
import { pick, safeDate } from '@lib/safe';

export default function CollectionView({ entity }:{ entity: 'properties'|'units'|'leases'|'tenants'|'owners' }) {
  const res = useAsync<any[]>(async (s)=>{
    const { items } = await fetchCollection(entity, { order:'updated_at.desc', limit:200, signal:s });
    return items as any[];
  }, [entity]);

  const rows = res.data || [];
  const cols = [
    { key:'name', header:'Name', render:(r:any)=> pick(r,'display_name','name','property_name','full_name','company_name','address1') || '(unnamed)' },
    { key:'city', header:'City', render:(r:any)=> pick(r,'city','mailing_city','location_city','prop_city') },
    { key:'state', header:'State', render:(r:any)=> pick(r,'state','mailing_state','location_state','prop_state') },
    { key:'updated', header:'Updated', render:(r:any)=> safeDate(r.updated_at || r.modified_at || r.created_at) , width:180 },
  ] as const;

  return (
    <div>
      <h1 style={{textTransform:'capitalize'}}>{entity}</h1>
      <div style={{color:'var(--muted)', margin:'6px 0 12px'}}>Loaded {rows.length} {entity}.</div>
      <Table columns={cols as any} rows={rows}/>
      {res.error ? <div className="panel" style={{marginTop:12, color:'var(--danger)'}}>Error: {String(res.error)}</div> : null}
    </div>
  );
}

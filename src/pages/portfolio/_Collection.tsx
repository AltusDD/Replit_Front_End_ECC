import React from 'react';
import { useCollection } from '@/lib/useApi';
import Table from '@/components/ui/Table';

export default function CollectionPage({ name }: { name: 'properties'|'units'|'leases'|'tenants'|'owners' }) {
  const { data, loading, error } = useCollection(name, { limit: 50 });

  return (
    <div className="grid" style={{gap:16}}>
      <div className="panel">
        <strong style={{color:'var(--muted)'}}>Status</strong><br/>
        {loading && <span>Loading…</span>}
        {error && <span className="error">API error: {String(error.message || error)}</span>}
        {!loading && !error && <span>OK</span>}
      </div>
      {!loading && !error && <Table rows={data} />}
    </div>
  );
}

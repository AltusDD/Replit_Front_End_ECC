import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@/lib/useApi';

export function CollectionPage({ title, name }: { title: string; name: string }) {
  const { data, loading, error } = useCollection(name, {});
  return (
    <>
      <div className="header"><h1>{title}</h1></div>
      {error && <div className="panel">API error: {String((error as any)?.message || error)}</div>}
      {loading ? <div className="panel">Loading…</div> : <Table rows={data} emptyHint="No results" />}
    </>
  );
}

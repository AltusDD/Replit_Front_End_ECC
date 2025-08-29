import React from 'react';
import Table, { Column } from '@/components/ui/Table';
import { getJSON } from '@/lib/fetcher';

type ListPageProps<T> = {
  title: string;
  path: string;      // e.g. '/api/properties?limit=25'
  columns: Column<T>[];
  sample?: T[];      // optional local data if API unreachable
};

export default function ListPage<T extends Record<string, any>>({ title, path, columns, sample }: ListPageProps<T>) {
  const [rows, setRows] = React.useState<T[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let act = true;
    getJSON<any>(path)
      .then(json => {
        // Try common shapes: {data:[...]}, direct array, {items:[...]}
        const arr = Array.isArray(json) ? json
          : Array.isArray(json?.data) ? json.data
          : Array.isArray(json?.items) ? json.items
          : null;
        if (act) setRows(arr ?? []);
      })
      .catch(e => {
        console.warn('API error for', path, e);
        setErr(e.message);
        if (sample) setRows(sample);
        else setRows([]);
      });
    return () => { act = false; };
  }, [path, sample]);

  return (
    <div>
      <h1>{title}</h1>
      {err && <div className="panel" style={{marginBottom:12}}>
        <div className="badge-muted">API error: {err}</div>
      </div>}
      <Table<any>
        columns={columns}
        rows={rows ?? []}
        empty={<span className="badge-muted">No results</span>}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { fetchCollection } from '@lib/api';

type Row = Record<string, any>;

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true); setError(null);
    fetchCollection('leases', { order: 'updated_at.desc', limit: 200, signal: ac.signal })
      .then(({ items }) => { if (!ac.signal.aborted) setRows(items || []); })
      .catch((e) => { if (!ac.signal.aborted && e?.name !== 'AbortError') setError(e); })
      .finally(() => { if (!ac.signal.aborted) setLoading(false); });
    return () => ac.abort();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 10, textTransform: 'capitalize' }}>leases ({rows.length} loaded)</h1>
      {error && <div style={{ color: 'var(--danger)' }}>Error: {String(error)}</div>}
      {loading ? <div>Loading…</div> : (
        <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 12 }}>
          {rows.slice(0, 5).map((r, i) => <pre key={i} style={{ background: 'var(--panel)', padding: 8, borderRadius: 6, margin: '6px 0' }}>{JSON.stringify(r, null, 2)}</pre>)}
          {rows.length === 0 && <div>No rows.</div>}
        </div>
      )}
    </div>
  );
}

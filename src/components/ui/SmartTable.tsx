import React from 'react';

type Props = { rows: any[]; loading?: boolean; error?: any; title?: string };

function primitiveColumns(rows: any[]): string[] {
  if (!rows?.length) return [];
  const first = rows.find((r: any) => r && typeof r === 'object') ?? {};
  return Object.keys(first)
    .filter((k) => ['string','number','boolean'].includes(typeof (first as any)[k]))
    .slice(0, 8);
}

function fmt(v: any){
  if (v == null) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function SmartTable({ rows, loading, error, title }: Props) {
  const cols = primitiveColumns(rows);
  return (
    <div className="panel">
      {title && <h3>{title}</h3>}
      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>API error: {String(error?.message ?? error)}</div>
      ) : !rows?.length ? (
        <div>No results</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((r: any, i: number) => (
                <tr key={r.id ?? r._id ?? i}>
                  {cols.map((c) => <td key={c}>{fmt(r[c])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React from 'react';

export type Col = { key: string; label?: string; width?: string; render?: (v:any,row:any)=>React.ReactNode };
export default function Table({ rows, columns }: { rows: any[]; columns?: Col[] }) {
  const cols: Col[] = columns && columns.length
    ? columns
    : (rows[0] ? Object.keys(rows[0]).slice(0, 8).map(k => ({ key:k, label:k })) : []);

  if (!rows.length) return <div className="panel">No results</div>;

  return (
    <div className="panel">
      <table className="table">
        <thead>
          <tr>{cols.map(c => <th key={c.key} style={{width:c.width}}>{c.label ?? c.key}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c.key}>{c.render ? c.render(r[c.key], r) : String(r[c.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

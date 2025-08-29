import React from 'react';

type Props = { rows: any[]; emptyHint?: string };

export default function Table({ rows, emptyHint = 'No results' }: Props) {
  if (!rows?.length) {
    return <div className="panel">{emptyHint}</div>;
  }
  const cols = Object.keys(rows[0] ?? {});
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{String(r?.[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

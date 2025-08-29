import React from 'react';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  empty?: React.ReactNode;
};

export default function Table<T extends Record<string, any>>({ columns, rows, empty }: Props<T>) {
  if (!rows?.length) {
    return <div className="panel">{empty ?? <span className="badge-muted">No rows</span>}</div>;
  }
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c, i) => <th key={i}>{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c, j) => (
                <td key={j} className={c.className}>
                  {c.render ? c.render(r) : String(r[c.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

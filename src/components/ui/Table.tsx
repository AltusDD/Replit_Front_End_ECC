import React from 'react';

export type Column<T = any> = {
  key: keyof T | string;
  label?: string;
  width?: string | number;
  render?: (row: T) => React.ReactNode;
};
type Props<T = any> = {
  rows: T[];
  columns?: Column<T>[];
  empty?: React.ReactNode;
  dense?: boolean;
};

export default function Table<T = any>({ rows, columns, empty, dense }: Props<T>) {
  const cols = React.useMemo<Column<T>[]>(() => {
    if (columns && columns.length) return columns;
    if (!rows.length) return [];
    return Object.keys(rows[0] as any).map((k) => ({ key: k, label: String(k) }));
  }, [rows, columns]);

  return (
    <div className="panel table-wrap">
      <table className={`table ${dense ? 'dense' : ''}`}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={String(c.key)} style={{ width: c.width }}>
                {c.label ?? String(c.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={String(c.key)}>
                    {c.render ? c.render(r) : String((r as any)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Math.max(cols.length, 1)}>
                {empty ?? <div className="muted">No results</div>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

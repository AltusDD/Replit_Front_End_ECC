import React from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyLabel?: string;
};

export default function DataTable<T>({ columns, rows, emptyLabel = "No results" }: DataTableProps<T>) {
  return (
    <div className="ecc-table-wrap">
      <table className="ecc-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} style={{ width: c.width }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ecc-table-empty">{emptyLabel}</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={String(c.key)}>
                    {c.render ? c.render(r) : (r as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

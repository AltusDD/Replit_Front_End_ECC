
import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <div className="overflow-x-auto border border-panel rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-panel-2 text-muted uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-2 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-panel-3 hover:bg-panel-2 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className={`px-4 py-2 ${col.className || ""}`}>
                  {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import './Table.css';

interface TableColumn {
  label: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onRowDoubleClick: (row: any) => void;
}

export default function Table({ columns, data, onRowDoubleClick }: TableProps) {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} onDoubleClick={() => onRowDoubleClick(row)} data-testid={`row-${row.id}`}>
              {columns.map((col) => (
                <td key={col.accessor} data-testid={`cell-${col.accessor}-${row.id}`}>
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
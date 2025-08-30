import React from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  onRowDoubleClick: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, onRowDoubleClick }) => {
  return (
    <div className="table-wrapper">
      <table className="enhanced-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="table-header">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="table-row"
              onDoubleClick={() => onRowDoubleClick(row)}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

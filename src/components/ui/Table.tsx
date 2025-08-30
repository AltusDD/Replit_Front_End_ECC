import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import "../Table.css";

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: string[];
}

interface TableProps<T> {
  rows: T[];
  cols: TableColumn<T>[];
  empty?: string;
  cap?: string;
  entityType?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export default function Table<T extends Record<string, any>>({
  rows,
  cols,
  empty = 'No results',
  cap,
  entityType,
  onRowClick,
  pageSize = 25
}: TableProps<T>) {
  const [, setLocation] = useLocation();
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfigs(prevConfigs => {
      const existingIndex = prevConfigs.findIndex(config => config.key === key);
      const newConfigs = [...prevConfigs];
      
      if (existingIndex >= 0) {
        const existing = newConfigs[existingIndex];
        if (existing.direction === 'asc') {
          newConfigs[existingIndex] = { key, direction: 'desc' };
        } else {
          newConfigs.splice(existingIndex, 1);
        }
      } else {
        newConfigs.unshift({ key, direction: 'asc' });
      }
      
      return newConfigs;
    });
  };

  // Filter and sort data
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Apply global search
    if (searchTerm) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter(row =>
          String(row[key]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply sorting
    sortConfigs.forEach(({ key, direction }) => {
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        const comparison = aVal < bVal ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
      });
    });

    return result;
  }, [rows, searchTerm, filters, sortConfigs]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + pageSize);

  // Handle double-click navigation
  const handleRowDoubleClick = (row: T) => {
    if (entityType && row.id) {
      setLocation(`/card/${entityType}/${row.id}`);
      // Telemetry event
      console.log('table_row_drilled', { entityType, id: row.id });
    }
    onRowClick?.(row);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    console.log('filter_applied', { column: key, value });
  };

  // Handle sort click
  const handleSortClick = (key: string) => {
    handleSort(key);
    console.log('column_sorted', { column: key, direction: sortConfigs.find(c => c.key === key)?.direction || 'asc' });
  };

  const getSortIcon = (key: string) => {
    const config = sortConfigs.find(config => config.key === key);
    if (!config) return '↕️';
    return config.direction === 'asc' ? '↑' : '↓';
  };

  const getRowClassName = (row: T) => {
    let className = 'table-row';
    
    // Conditional styling based on entity type and data
    if (entityType === 'tenant' && row.total_balance_due && row.total_balance_due > 0) {
      className += ' delinquent';
    }
    if (entityType === 'unit' && (!row.tenant_name || row.status === 'vacant')) {
      className += ' vacant';
    }
    if (entityType === 'property' && row.health_score && row.health_score < 70) {
      className += ' at-risk';
    }
    
    return className;
  };

  return (
    <div className="enhanced-table-container">
      {cap && <div className="table-caption">{cap}</div>}
      
      {/* Global Search */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="global-search"
          data-testid="table-search"
        />
      </div>

      <div className="table-wrapper">
        <table className="enhanced-table">
          <thead className="sticky-header">
            <tr>
              {cols.map((col, i) => (
                <th key={i} style={{ width: col.width }} className="table-header">
                  <div className="header-content">
                    <span
                      className={col.sortable !== false ? 'sortable-header' : ''}
                      onClick={col.sortable !== false ? () => handleSortClick(String(col.key)) : undefined}
                      data-testid={`header-${String(col.key)}`}
                    >
                      {col.label} {col.sortable !== false && getSortIcon(String(col.key))}
                    </span>
                    {col.filterable !== false && (
                      <input
                        type="text"
                        placeholder={`Filter ${col.label}...`}
                        value={filters[String(col.key)] || ''}
                        onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                        className="column-filter"
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`filter-${String(col.key)}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="empty-state">
                  {empty}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={getRowClassName(row)}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  data-testid={`row-${entityType}-${row.id}`}
                >
                  {cols.map((col, colIndex) => {
                    const value = col.render ? col.render(row) : (row[col.key as string] ?? '');
                    return (
                      <td key={colIndex} data-testid={`cell-${String(col.key)}-${row.id}`}>
                        {React.isValidElement(value) ? value : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <span className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredAndSortedRows.length)} of {filteredAndSortedRows.length}
          </span>
          <div className="pagination-buttons">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
              data-testid="page-prev"
            >
              Previous
            </button>
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
              data-testid="page-next"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
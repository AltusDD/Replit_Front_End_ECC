import React, { useMemo, useState, useCallback, useEffect } from "react";

// Genesis Column interface as per spec
interface Column {
  key: string;
  header: string;
  align?: "left" | "right";
  type?: "text" | "enum" | "number" | "date";
  enumValues?: string[];
  render?: (row: any) => React.ReactNode;
}

type DataTableProps = {
  rows: any[];
  columns: Column[];
  initialSort?: { key: string; dir: "asc" | "desc" }[];
  getRowId?: (r: any) => string | number | undefined;
  drawerTitle?: (r: any) => string;
  loading?: boolean;
  error?: string | null;
  csvName?: string;
};

// Utilities
function getByPath(obj: any, path: string): any {
  if (!path.includes(".")) return obj?.[path];
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function isNumberLike(v: any): boolean {
  return typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)));
}

function formatCSVCell(v: any): string {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// Sorting utilities
function compareValues(a: any, b: any, column: Column): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (column.type === "number" || (column.type === undefined && isNumberLike(a) && isNumberLike(b))) {
    return Number(a) - Number(b);
  }
  
  if (column.type === "date") {
    return new Date(a).valueOf() - new Date(b).valueOf();
  }
  
  return String(a).localeCompare(String(b));
}

// Drawer component for row details
function AssetDrawer({ row, isOpen, onClose, title }: {
  row: any;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="ecc-drawer-backdrop" onClick={onClose}>
      <div className="ecc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ecc-drawer-header">
          <h2>{title || "Asset Details"}</h2>
          <button onClick={onClose} aria-label="Close drawer">×</button>
        </div>
        <div className="ecc-drawer-body">
          <div className="ecc-asset-card">
            <div className="ecc-asset-card-title">{title}</div>
            <div className="ecc-asset-card-stats">
              {Object.entries(row).map(([key, value]) => (
                <div key={key} className="ecc-stat">
                  <div className="ecc-stat-label">{key.replace(/_/g, " ").toUpperCase()}</div>
                  <div className="ecc-stat-value">{value != null ? String(value) : "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Actions menu component
function ActionsMenu({ row, onViewDetails, onCopyLink, onExportRow }: {
  row: any;
  onViewDetails: () => void;
  onCopyLink: () => void;
  onExportRow: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ecc-actions-menu">
      <button 
        className="ecc-actions-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Row actions"
      >
        ⋯
      </button>
      {isOpen && (
        <div className="ecc-actions-dropdown">
          <button onClick={() => { onViewDetails(); setIsOpen(false); }}>
            View details
          </button>
          <button onClick={() => { onCopyLink(); setIsOpen(false); }}>
            Copy row link
          </button>
          <button onClick={() => { onExportRow(); setIsOpen(false); }}>
            Export row JSON
          </button>
        </div>
      )}
    </div>
  );
}

export default function DataTable({
  rows,
  columns,
  initialSort = [],
  getRowId = (r) => r?.id,
  drawerTitle = (r) => `Row ${getRowId(r) || "Details"}`,
  loading = false,
  error = null,
  csvName = "data"
}: DataTableProps) {
  // State
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [sortState, setSortState] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRow, setDrawerRow] = useState<any>(null);

  // Detect column types and enum values
  const enhancedColumns = useMemo(() => {
    return columns.map(col => {
      if (col.type || col.enumValues) return col;
      
      const values = rows.map(row => getByPath(row, col.key)).filter(v => v != null && v !== "");
      
      if (values.every(v => isNumberLike(v))) {
        return { ...col, type: "number" as const };
      }
      
      const uniqueValues = Array.from(new Set(values.map(String)));
      if (uniqueValues.length > 0 && uniqueValues.length <= 10) {
        return { ...col, type: "enum" as const, enumValues: uniqueValues.sort() };
      }
      
      return { ...col, type: "text" as const };
    });
  }, [columns, rows]);

  // Filter and sort data
  const processedRows = useMemo(() => {
    let filtered = rows;

    // Global search
    if (globalSearch.trim()) {
      const searchLower = globalSearch.toLowerCase();
      filtered = filtered.filter(row =>
        enhancedColumns.some(col => {
          const value = col.render ? 
            String(col.render(row)).toLowerCase() : 
            String(getByPath(row, col.key) || "").toLowerCase();
          return value.includes(searchLower);
        })
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, filterValue]) => {
      if (!filterValue || (typeof filterValue === "string" && !filterValue.trim())) return;
      
      const column = enhancedColumns.find(c => c.key === key);
      if (!column) return;

      filtered = filtered.filter(row => {
        const cellValue = getByPath(row, key);
        
        if (column.type === "enum") {
          return String(cellValue) === String(filterValue);
        }
        
        if (column.type === "number" && typeof filterValue === "object") {
          const num = Number(cellValue);
          if (isNaN(num)) return false;
          const { min, max } = filterValue;
          return (min === undefined || num >= min) && (max === undefined || num <= max);
        }
        
        return String(cellValue || "").toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });

    // Sorting
    if (sortState.length > 0) {
      filtered.sort((a, b) => {
        for (const { key, dir } of sortState) {
          const column = enhancedColumns.find(c => c.key === key);
          if (!column) continue;
          
          const aVal = getByPath(a, key);
          const bVal = getByPath(b, key);
          const comparison = compareValues(aVal, bVal, column);
          
          if (comparison !== 0) {
            return dir === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [rows, globalSearch, columnFilters, sortState, enhancedColumns]);

  // Pagination
  const totalPages = Math.ceil(processedRows.length / pageSize);
  const paginatedRows = processedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Event handlers
  const handleSort = useCallback((key: string, shiftKey: boolean) => {
    setSortState(prev => {
      const existing = prev.find(s => s.key === key);
      const others = prev.filter(s => s.key !== key);
      
      if (!existing) {
        const newSort = { key, dir: "asc" as const };
        return shiftKey ? [...others, newSort] : [newSort];
      }
      
      const newDir = existing.dir === "asc" ? "desc" : "asc";
      const newSort = { key, dir: newDir };
      return shiftKey ? [...others, newSort] : [newSort];
    });
  }, []);

  const handleRowClick = useCallback((row: any) => {
    const id = getRowId(row);
    setSelectedRowId(id);
  }, [getRowId]);

  const handleRowDoubleClick = useCallback((row: any) => {
    setDrawerRow(row);
    setDrawerOpen(true);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = enhancedColumns.map(col => col.header);
    const csvRows = processedRows.map(row =>
      enhancedColumns.map(col => {
        const value = col.render ? 
          String(col.render(row)) : 
          getByPath(row, col.key);
        return formatCSVCell(value);
      })
    );
    
    const csvContent = [headers, ...csvRows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${csvName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [enhancedColumns, processedRows, csvName]);

  const handleCopyRowLink = useCallback((row: any) => {
    const id = getRowId(row);
    const path = `/portfolio/${csvName}/${id}`;
    navigator.clipboard.writeText(window.location.origin + path);
  }, [getRowId, csvName]);

  const handleExportRowJSON = useCallback((row: any) => {
    const json = JSON.stringify(row, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `row-${getRowId(row)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [getRowId]);

  // Loading state
  if (loading) {
    return (
      <div className="ecc-table-container">
        <div className="ecc-table-skeleton">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="ecc-skeleton-row">
              {enhancedColumns.map((_, j) => (
                <div key={j} className="ecc-skeleton-cell" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="ecc-table-container">
        <div className="ecc-error-state">
          <div className="ecc-error-message">{error}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ecc-table-container">
      {/* Search and Export Controls */}
      <div className="ecc-table-controls">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="ecc-global-search"
        />
        <button onClick={handleExportCSV} className="ecc-export-btn">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="ecc-table-wrapper">
        <table className="ecc-table">
          <thead className="ecc-table-head">
            <tr>
              {enhancedColumns.map((col) => (
                <th
                  key={col.key}
                  className={`ecc-th ${col.align === "right" ? "ecc-th--right" : ""}`}
                  onClick={(e) => handleSort(col.key, e.shiftKey)}
                >
                  <span className="ecc-th-content">
                    {col.header}
                    {sortState.find(s => s.key === col.key) && (
                      <span className="ecc-sort-indicator">
                        {sortState.find(s => s.key === col.key)?.dir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              <th className="ecc-th ecc-th--actions">Actions</th>
            </tr>
            {/* Filter Row */}
            <tr className="ecc-filter-row">
              {enhancedColumns.map((col) => (
                <th key={col.key} className="ecc-filter-cell">
                  {col.type === "enum" ? (
                    <select
                      value={columnFilters[col.key] || ""}
                      onChange={(e) => setColumnFilters(prev => ({
                        ...prev,
                        [col.key]: e.target.value || undefined
                      }))}
                      className="ecc-filter-select"
                    >
                      <option value="">All</option>
                      {col.enumValues?.map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  ) : col.type === "number" ? (
                    <div className="ecc-number-filter">
                      <input
                        type="number"
                        placeholder="Min"
                        value={columnFilters[col.key]?.min || ""}
                        onChange={(e) => setColumnFilters(prev => ({
                          ...prev,
                          [col.key]: {
                            ...prev[col.key],
                            min: e.target.value ? Number(e.target.value) : undefined
                          }
                        }))}
                        className="ecc-filter-input ecc-filter-input--min"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={columnFilters[col.key]?.max || ""}
                        onChange={(e) => setColumnFilters(prev => ({
                          ...prev,
                          [col.key]: {
                            ...prev[col.key],
                            max: e.target.value ? Number(e.target.value) : undefined
                          }
                        }))}
                        className="ecc-filter-input ecc-filter-input--max"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={columnFilters[col.key] || ""}
                      onChange={(e) => setColumnFilters(prev => ({
                        ...prev,
                        [col.key]: e.target.value || undefined
                      }))}
                      className="ecc-filter-input"
                    />
                  )}
                </th>
              ))}
              <th className="ecc-filter-cell" />
            </tr>
          </thead>
          <tbody className="ecc-table-body">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={enhancedColumns.length + 1} className="ecc-empty-state">
                  <div className="ecc-empty-content">
                    <div className="ecc-empty-icon">📋</div>
                    <div>No results found</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = rowId === selectedRowId;
                
                return (
                  <tr
                    key={rowId || index}
                    className={`ecc-tr ${isSelected ? "ecc-tr--selected" : ""}`}
                    onClick={() => handleRowClick(row)}
                    onDoubleClick={() => handleRowDoubleClick(row)}
                  >
                    {enhancedColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`ecc-td ${col.align === "right" ? "ecc-td--right" : ""}`}
                      >
                        {col.render ? col.render(row) : (getByPath(row, col.key) ?? "—")}
                      </td>
                    ))}
                    <td className="ecc-td ecc-td--actions">
                      <ActionsMenu
                        row={row}
                        onViewDetails={() => handleRowDoubleClick(row)}
                        onCopyLink={() => handleCopyRowLink(row)}
                        onExportRow={() => handleExportRowJSON(row)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="ecc-table-footer">
        <div className="ecc-table-info">
          {processedRows.length} results
          {processedRows.length !== rows.length && ` (filtered from ${rows.length})`}
        </div>
        
        <div className="ecc-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="ecc-pagination-btn"
          >
            Previous
          </button>
          
          <span className="ecc-pagination-info">
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="ecc-pagination-btn"
          >
            Next
          </button>
          
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="ecc-page-size-select"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={200}>200 per page</option>
          </select>
        </div>
      </div>

      {/* Asset Drawer */}
      <AssetDrawer
        row={drawerRow}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerRow ? drawerTitle(drawerRow) : ""}
      />
    </div>
  );
}
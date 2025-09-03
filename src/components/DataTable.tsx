// src/components/DataTable.tsx
import React, { useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
  sort?: (a: T, b: T) => number;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode; // page-specific filters
};

function toCSV<T>(rows: T[], columns: Column<T>[]) {
  const headers = columns.map((c) => `"${String(c.header).replace(/"/g, '""')}"`).join(",");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const v =
            c.render ? (c.render(r) as any) :
            (r as any)[c.key as any];
          const s = (typeof v === "string" ? v : v == null ? "" : String(v)).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    )
    .join("\n");
  return headers + "\n" + body;
}

export function DataTable<T>(props: Props<T>) {
  const {
    rows,
    columns,
    loading,
    error,
    toolbar,
    pageSizeOptions = [25, 50, 100],
    defaultPageSize = 50,
    searchPlaceholder = "Search…",
  } = props;

  const [q, setQ] = useState("");
  const [sortIdx, setSortIdx] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r: any) =>
      Object.values(r || {}).some((v) => String(v ?? "").toLowerCase().includes(needle))
    );
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (sortIdx == null) return filtered;
    const col = columns[sortIdx];
    const fn =
      col.sort ||
      ((a: any, b: any) => {
        const av = a[col.key as any];
        const bv = b[col.key as any];
        return String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      });
    const copy = filtered.slice().sort(fn);
    return sortDir === "asc" ? copy : copy.reverse();
  }, [filtered, sortIdx, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = useMemo(() => {
    const from = page * pageSize;
    return sorted.slice(from, from + pageSize);
  }, [sorted, page, pageSize]);

  function onHeaderClick(i: number) {
    if (sortIdx === i) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortIdx(i);
      setSortDir("asc");
    }
  }

  function exportCSV() {
    const csv = toCSV(sorted, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-table-toolbar">
        <div className="ecc-table-toolbar-left">{toolbar}</div>
        <div className="ecc-table-toolbar-right">
          <input
            className="ecc-input"
            placeholder={searchPlaceholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
          />
          <select
            className="ecc-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>{n}/page</option>
            ))}
          </select>
          <button className="ecc-btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {error && <div className="ecc-error">Error: {error}</div>}
      {loading && <div className="ecc-loading">Loading…</div>}

      <div className="ecc-table-scroller">
        <table className="ecc-table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th
                  key={String(c.key)}
                  className={c.className}
                  onClick={() => onHeaderClick(i)}
                >
                  <span>{c.header}</span>
                  {sortIdx === i && <span className="ecc-sort">{sortDir === "asc" ? "▲" : "▼"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && pageRows.length === 0 && (
              <tr><td colSpan={columns.length} className="ecc-empty">No rows</td></tr>
            )}
            {pageRows.map((r, i) => (
              <tr key={(r as any).id ?? i}>
                {columns.map((c) => {
                  const raw = (r as any)[c.key as any];
                  return (
                    <td key={String(c.key)} className={c.className}>
                      {c.render ? c.render(r) : (raw == null ? "—" : String(raw))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ecc-table-footer">
        <div className="ecc-muted">Rows: {sorted.length}</div>
        <div className="ecc-pager">
          <button className="ecc-btn" disabled={page === 0} onClick={() => setPage(0)}>⏮</button>
          <button className="ecc-btn" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>◀</button>
          <span className="ecc-muted">Page {page + 1} / {totalPages}</span>
          <button className="ecc-btn" disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>▶</button>
          <button className="ecc-btn" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>⏭</button>
        </div>
      </div>
    </div>
  );
}

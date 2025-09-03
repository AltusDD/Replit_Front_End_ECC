// src/components/DataTable.tsx
import React, { useMemo, useState } from "react";
import "@/styles/table.css";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  width?: string | number;
  render?: (row: T) => React.ReactNode;
  sort?: (a: T, b: T) => number;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  initialSortKey?: string;
  pageSizes?: number[];
  toolbar?: React.ReactNode;
  searchKeys?: (keyof T | string)[];
};

function toCSV<T>(rows: T[], columns: Column<T>[]) {
  const headers = columns.map(c => c.header);
  const lines = rows.map(r =>
    columns.map(c => {
      const v = typeof c.key === "string" ? (r as any)[c.key] : (r as any)[c.key as string];
      const text = (typeof v === "string" || typeof v === "number") ? String(v) : "";
      return `"${text.replace(/"/g, '""')}"`;
    }).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export function DataTable<T>(props: Props<T>) {
  const { rows, columns, pageSizes = [25, 50, 100], searchKeys = columns.map(c => c.key) } = props;
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(props.initialSortKey || String(columns[0]?.key || ""));
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[1] || 50);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r: any) =>
      searchKeys.some(k => String(r[k as any] ?? "").toLowerCase().includes(q))
    );
  }, [rows, search, searchKeys]);

  const sorted = useMemo(() => {
    const col = columns.find(c => String(c.key) === sortKey);
    const copy = [...filtered];
    copy.sort((a: any, b: any) => {
      if (col?.sort) return (sortDir === "asc" ? 1 : -1) * col.sort(a, b);
      const av = a[sortKey as any]; const bv = b[sortKey as any];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (sortDir === "asc" ? av - bv : bv - av);
      return (sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)));
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const exportCSV = () => {
    const csv = toCSV(sorted, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="ecc-toolbar">
        {props.toolbar}
        <input
          placeholder="Search…"
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
        />
        <select value={pageSize} onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}>
          {pageSizes.map(n => <option key={n} value={n}>{n}/page</option>)}
        </select>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <table className="ecc-table">
        <thead>
          <tr>
            {columns.map(c => (
              <th
                key={String(c.key)}
                style={{ width: c.width }}
                onClick={() => {
                  const k = String(c.key);
                  if (sortKey === k) setSortDir(d => (d === "asc" ? "desc" : "asc"));
                  else { setSortKey(k); setSortDir("asc"); }
                }}
              >
                {c.header}{sortKey === String(c.key) ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r, i) => (
            <tr key={(r as any).id || i}>
              {columns.map(c => (
                <td key={String(c.key)}>
                  {c.render ? c.render(r) : (r as any)[c.key as any] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
          {!pageRows.length && (
            <tr><td colSpan={columns.length}>No records</td></tr>
          )}
        </tbody>
      </table>

      <div className="ecc-toolbar" style={{ justifyContent: "space-between" }}>
        <div>Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, sorted.length)} of {sorted.length}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage(1)} disabled={page===1}>⏮</button>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>◀</button>
          <span>Page {page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>▶</button>
          <button onClick={() => setPage(totalPages)} disabled={page===totalPages}>⏭</button>
        </div>
      </div>
    </div>
  );
}

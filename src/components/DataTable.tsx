import React, { useMemo, useState } from "react";
import "@/styles/table.css";

type Align = "left" | "right" | "center";
export type Col<T> = {
  key: keyof T & string;
  header: string;
  align?: Align;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  rows,
  loading,
  error,
  emptyText = "No data",
  searchKeys,
  pageSize = 50,
  rowKey,
}: {
  title?: string;
  columns: Col<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
  searchKeys?: (keyof T & string)[];
  pageSize?: number;
  rowKey?: (row: T, index: number) => React.Key;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const keys = searchKeys || (columns.map(c => c.key) as (keyof T & string)[]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(r =>
      keys.some(k => (r?.[k] ?? "").toString().toLowerCase().includes(q))
    );
  }, [rows, query, keys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const copy = filtered.slice();
    copy.sort((a, b) => {
      const av = a?.[sortKey as keyof T];
      const bv = b?.[sortKey as keyof T];
      // number first, then string
      const an = typeof av === "number" ? av : Number(av);
      const bn = typeof bv === "number" ? bv : Number(bv);
      if (isFinite(an) && isFinite(bn)) return sortDir === "asc" ? an - bn : bn - an;
      const as = (av ?? "").toString().toLowerCase();
      const bs = (bv ?? "").toString().toLowerCase();
      return sortDir === "asc" ? (as > bs ? 1 : as < bs ? -1 : 0) : (as < bs ? 1 : as > bs ? -1 : 0);
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = sorted.slice(page * pageSize, page * pageSize + pageSize);

  function onSort(k: string) {
    setPage(0);
    if (sortKey !== k) {
      setSortKey(k);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
  }

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-title">
          {title ?? "Table"}
          <span className="muted"> {loading ? "Loading…" : `(${filtered.length})`}</span>
        </div>
        <div className="table-tools">
          <input
            className="table-search"
            placeholder="Search…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          />
        </div>
      </div>

      {error && <div className="table-error">Error: {error}</div>}

      <div className="table-wrap">
        <table className="ecc-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width, textAlign: c.align ?? "left" }}
                  onClick={() => onSort(c.key)}
                  className={sortKey === c.key ? `sorted ${sortDir}` : undefined}
                  role="button"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && current.length === 0 && (
              <tr><td colSpan={columns.length} className="empty">Loading…</td></tr>
            )}
            {!loading && current.length === 0 && (
              <tr><td colSpan={columns.length} className="empty">{emptyText}</td></tr>
            )}
            {current.map((r, i) => (
              <tr key={rowKey ? rowKey(r, i) : i}>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? "left" }}>
                    {c.render ? c.render(r) : display(r[c.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="table-pager">
          <button disabled={page === 0} onClick={() => setPage(0)}>&laquo;</button>
          <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p-1))}>&lsaquo;</button>
          <span>Page {page+1} / {pages}</span>
          <button disabled={page >= pages-1} onClick={() => setPage(p => Math.min(pages-1, p+1))}>&rsaquo;</button>
          <button disabled={page >= pages-1} onClick={() => setPage(pages-1)}>&raquo;</button>
        </div>
      )}
    </div>
  );
}

function display(v: any) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}
import * as React from "react";

export type Column<T> = {
  /** Object key to read when no custom render is provided */
  key: keyof T | string;
  /** Table header text */
  header: string;
  /** Optional cell className (e.g., "is-right") */
  className?: string;
  /** Custom cell renderer (receives the full row) */
  render?: (row: T) => React.ReactNode;
  /** Custom comparator; if omitted, primitive compare is used */
  sort?: (a: T, b: T) => number;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];

  /** Optional UX niceties */
  toolbar?: React.ReactNode;
  placeholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;

  /** Optional status props (safe to omit) */
  loading?: boolean;
  error?: string | null;
};

function textifyCell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  // Try to pull children text from simple React elements
  // @ts-expect-error runtime check only
  const ch = v?.props?.children;
  if (typeof ch === "string" || typeof ch === "number") return String(ch);
  if (Array.isArray(ch)) return ch.map(textifyCell).join(" ");
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function DataTable<T>({
  columns,
  rows,
  toolbar,
  placeholder = "Search…",
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 50,
  loading,
  error,
}: Props<T>) {
  const [q, setQ] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(0);
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  // Text filter across stringified rows
  const filtered = React.useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r: any) =>
      JSON.stringify(r).toLowerCase().includes(needle)
    );
  }, [rows, q]);

  // Sorting
  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => String(c.key) === sortKey);
    const arr = [...filtered];
    arr.sort((a: any, b: any) => {
      if (col?.sort) return col.sort(a, b);
      const va = a?.[sortKey];
      const vb = b?.[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return -1;
      if (vb == null) return 1;
      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return String(va).localeCompare(String(vb), undefined, { numeric: true });
    });
    return sortDir === "asc" ? arr : arr.reverse();
  }, [filtered, columns, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = sorted.slice(start, end);

  // CSV export (filtered + sorted)
  function exportCSV() {
    const headers = columns.map((c) => `"${String(c.header).replace(/"/g, '""')}"`).join(",");
    const body = sorted
      .map((row) =>
        columns
          .map((c) => {
            const raw = c.render ? c.render(row) : (row as any)[c.key as any];
            const txt = textifyCell(raw).replace(/"/g, '""');
            return `"${txt}"`;
          })
          .join(",")
      )
      .join("\n");
    const csv = [headers, body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function onHeaderClick(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
    setPage(0);
  }

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-table-toolbar">
        {toolbar}
        <div className="ecc-toolbar-spacer" />
        <input
          className="ecc-input"
          placeholder={placeholder}
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
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
        <button className="ecc-btn" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {error && <div className="ecc-error">Error: {error}</div>}
      {loading && <div className="ecc-loading">Loading…</div>}

      <table className="ecc-table">
        <thead>
          <tr>
            {columns.map((c) => {
              const key = String(c.key);
              const active =
                sortKey === key ? (sortDir === "asc" ? " asc" : " desc") : "";
              return (
                <th
                  key={key}
                  className={`is-clickable${active}`}
                  onClick={() => onHeaderClick(key)}
                  title="Click to sort"
                >
                  {c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {!loading && pageRows.length === 0 ? (
            <tr>
              <td className="is-empty" colSpan={columns.length}>
                No results
              </td>
            </tr>
          ) : (
            pageRows.map((row, i) => (
              <tr key={(row as any)?.id ?? i}>
                {columns.map((c) => {
                  const cell =
                    c.render ? c.render(row) : (row as any)[c.key as any];
                  return (
                    <td key={String(c.key)} className={c.className || ""}>
                      {cell == null || cell === "" ? "—" : cell}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="ecc-table-footer">
        <div className="ecc-foot-left">
          {total.toLocaleString()} result{total === 1 ? "" : "s"}
        </div>
        <div className="ecc-foot-right">
          <button
            className="ecc-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
        <span className="ecc-page">
            {total === 0 ? 0 : page + 1} / {pageCount}
          </span>
          <button
            className="ecc-btn"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Also provide default export so both import styles work.
export default DataTable;

import * as React from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  /** Custom cell renderer (receive the full row) */
  render?: (row: T) => React.ReactNode;
  /** Custom sorter (a,b) -> number; if empty falls back to primitive compare */
  sort?: (a: T, b: T) => number;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  placeholder?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 50,
  placeholder = "Search…",
}: Props<T>) {
  const [q, setQ] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(0);
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  // Text filter (simple, fast)
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
    arr.sort((a, b) => {
      if (col?.sort) return col.sort(a, b);
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return -1;
      if (vb == null) return 1;
      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return String(va).localeCompare(String(vb));
    });
    return sortDir === "asc" ? arr : arr.reverse();
  }, [filtered, columns, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = sorted.slice(start, end);

  // CSV export of the **filtered + sorted** set (not just the page)
  const exportCsv = () => {
    const keys = columns.map((c) => c.header);
    const toCell = (row: any, col: Column<any>) => {
      const raw = col.render ? col.render(row) : (row as any)[col.key as any];
      const txt =
        typeof raw === "string"
          ? raw
          : typeof raw === "number"
          ? String(raw)
          : // strip tags if someone passes a React element with text
            String((raw as any)?.props?.children ?? raw ?? "");
      return `"${txt.replaceAll('"', '""')}"`;
    };
    const body = sorted
      .map((r) => columns.map((c) => toCell(r, c)).join(","))
      .join("\n");
    const csv = [keys.join(","), body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClickHeader = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
    setPage(0);
  };

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-table-toolbar">
        <input
          className="ecc-input"
          placeholder={placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <div className="ecc-toolbar-spacer" />
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
        <button className="ecc-btn" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <table className="ecc-table">
        <thead>
          <tr>
            {columns.map((c) => {
              const key = String(c.key);
              const active = sortKey === key ? ` ${sortDir}` : "";
              return (
                <th
                  key={key}
                  className={`is-clickable${active}`}
                  onClick={() => onClickHeader(key)}
                  title="Click to sort"
                >
                  {c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="is-empty">
                No results
              </td>
            </tr>
          ) : (
            pageRows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={String(c.key)} className={c.className || ""}>
                    {c.render ? c.render(row) : (row as any)[c.key as any] ?? "—"}
                  </td>
                ))}
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
            {total === 0 ? 0 : page + 1} / {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <button
            className="ecc-btn"
            disabled={end >= total}
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(total / pageSize) - 1, p + 1))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

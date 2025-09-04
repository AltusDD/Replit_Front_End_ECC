import React, { useMemo, useState, useEffect, useRef } from "react";

/** Column definition */
export type Column<Row> = {
  key: keyof Row | string;
  header: string;
  width?: number | string;
  align?: "left" | "right" | "center";
  /** "text" | "numeric" | custom comparator */
  sort?: "text" | "numeric" | ((a: Row, b: Row) => number);
  /** "text" | "select" | "numberRange" */
  filter?: "text" | "select" | "numberRange";
  /** predefined options for select filter (otherwise inferred from rows) */
  options?: Array<string | number>;
  /** custom cell renderer */
  render?: (row: Row) => React.ReactNode;
};

type PageSize = 25 | 50 | 100 | 200;
type NumberRange = { min?: number; max?: number };
type FilterState = Record<string, string | number | NumberRange | undefined>;

export type DataTableProps<Row> = {
  rows: Row[];
  columns: Column<Row>[];
  loading?: boolean;
  getRowId?: (row: Row, index: number) => string | number;
  enableGlobalSearch?: boolean;
  globalSearchPlaceholder?: string;
  onRowClick?: (row: Row) => void;
  actions?: (row: Row) => React.ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
  pageSizeOptions?: PageSize[];
  defaultPageSize?: PageSize;
  csvName?: string;
};

function toCSV(rows: any[], cols: Column<any>[]) {
  const headers = cols.map((c) => c.header);
  const lines = rows.map((r) =>
    cols
      .map((c) => {
        const k = c.key as string;
        const v = (r as any)[k];
        const text =
          typeof v === "string" || typeof v === "number"
            ? String(v)
            : v == null
            ? ""
            : JSON.stringify(v);
        return `"${text.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function getCell(row: any, key: string) {
  const parts = key.split(".");
  let cur = row;
  for (const p of parts) cur = cur?.[p];
  return cur;
}

export function DataTable<Row extends Record<string, any>>({
  rows,
  columns,
  loading = false,
  getRowId,
  enableGlobalSearch = true,
  globalSearchPlaceholder = "Search…",
  onRowClick,
  actions,
  initialSort,
  pageSizeOptions = [25, 50, 100, 200],
  defaultPageSize = 25,
  csvName = "export",
}: DataTableProps<Row>) {
  const [sortKey, setSortKey] = useState<string | null>(initialSort?.key ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSort?.dir ?? "asc");

  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  const [pageSize, setPageSize] = useState<PageSize>(defaultPageSize);
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [q, pageSize, rows.length, JSON.stringify(filters)]);

  const selectOptionsByKey = useMemo(() => {
    const map: Record<string, Array<string | number>> = {};
    columns.forEach((c) => {
      if (c.filter === "select") {
        if (c.options?.length) map[c.key as string] = c.options;
        else {
          const vals = new Set<string | number>();
          rows.forEach((r) => {
            const v = getCell(r, c.key as string);
            if (v != null && v !== "") vals.add(v);
          });
          map[c.key as string] = Array.from(vals).sort((a, b) =>
            String(a).localeCompare(String(b))
          );
        }
      }
    });
    return map;
  }, [rows, columns]);

  const filtered = useMemo(() => {
    const lc = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (enableGlobalSearch && lc) {
        const hit = columns.some((c) => {
          const v = getCell(r, c.key as string);
          if (v == null) return false;
          return String(v).toLowerCase().includes(lc);
        });
        if (!hit) return false;
      }
      for (const c of columns) {
        const k = c.key as string;
        const f = filters[k];
        if (f == null || f === "") continue;

        const cell = getCell(r, k);

        if (c.filter === "text") {
          const s = String(cell ?? "").toLowerCase();
          if (!s.includes(String(f).toLowerCase())) return false;
        } else if (c.filter === "select") {
          if (String(cell ?? "") !== String(f)) return false;
        } else if (c.filter === "numberRange") {
          const { min, max } = (f as NumberRange) || {};
          const n = Number(cell ?? NaN);
          if (!Number.isFinite(n)) return false;
          if (min != null && n < min) return false;
          if (max != null && n > max) return false;
        }
      }
      return true;
    });
  }, [rows, columns, q, filters, enableGlobalSearch]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => (c.key as string) === sortKey);
    if (!col) return filtered;

    const cmp =
      typeof col.sort === "function"
        ? (a: Row, b: Row) => col.sort!(a, b)
        : col.sort === "numeric"
        ? (a: Row, b: Row) =>
            Number(getCell(a, sortKey)) - Number(getCell(b, sortKey))
        : (a: Row, b: Row) =>
            String(getCell(a, sortKey) ?? "").localeCompare(
              String(getCell(b, sortKey) ?? "")
            );

    const out = [...filtered].sort(cmp);
    return sortDir === "asc" ? out : out.reverse();
  }, [filtered, sortKey, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const curPage = Math.min(page, pageCount - 1);
  const start = curPage * pageSize;
  const end = start + pageSize;
  const pageRows = sorted.slice(start, end);

  function toggleSort(key: string, allowSort: boolean) {
    if (!allowSort) return;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
  }

  function handleExport() {
    download(csvName, toCSV(sorted, columns));
  }

  const tableRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!tableRef.current) return;
      const open = tableRef.current.querySelectorAll("details[open]");
      open.forEach((d) => {
        if (!d.contains(e.target as Node)) (d as HTMLDetailsElement).open = false;
      });
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-table-toolbar">
        {enableGlobalSearch && (
          <input
            className="ecc-input"
            placeholder={globalSearchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        )}
        <div className="ecc-toolbar-spacer" />
        <button className="ecc-btn" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <table className="ecc-table" ref={tableRef}>
        <thead>
          <tr>
            {columns.map((c) => {
              const k = c.key as string;
              const canSort = !!c.sort;
              const thClass =
                "is-" +
                (c.align ?? "left") +
                (canSort ? " is-clickable" : "") +
                (sortKey === k ? ` ${sortDir}` : "");
              return (
                <th
                  key={k}
                  style={{ width: c.width }}
                  className={thClass}
                  onClick={() => toggleSort(k, canSort)}
                >
                  {c.header}
                </th>
              );
            })}
            {actions && <th className="is-right" style={{ width: 44 }} />}
          </tr>

          <tr className="ecc-filterRow">
            {columns.map((c) => {
              const k = c.key as string;
              if (!c.filter) return <th key={k} />;
              if (c.filter === "text") {
                return (
                  <th key={k}>
                    <input
                      className="ecc-input ecc-input--sm"
                      placeholder="Filter…"
                      value={(filters[k] as string) ?? ""}
                      onChange={(e) =>
                        setFilters((fs) => ({ ...fs, [k]: e.target.value }))
                      }
                    />
                  </th>
                );
              }
              if (c.filter === "select") {
                const opts = selectOptionsByKey[k] || [];
                return (
                  <th key={k}>
                    <select
                      className="ecc-select ecc-select--sm"
                      value={(filters[k] as string) ?? ""}
                      onChange={(e) =>
                        setFilters((fs) => ({
                          ...fs,
                          [k]: e.target.value || undefined,
                        }))
                      }
                    >
                      <option value="">All</option>
                      {opts.map((o) => (
                        <option key={String(o)} value={String(o)}>
                          {String(o)}
                        </option>
                      ))}
                    </select>
                  </th>
                );
              }
              const val = (filters[k] as NumberRange) || {};
              return (
                <th key={k}>
                  <div className="ecc-range">
                    <input
                      className="ecc-input ecc-input--xs"
                      type="number"
                      placeholder="Min"
                      value={val.min ?? ""}
                      onChange={(e) =>
                        setFilters((fs) => ({
                          ...fs,
                          [k]: {
                            ...((fs[k] as NumberRange) || {}),
                            min:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          },
                        }))
                      }
                    />
                    <span className="ecc-range-sep">–</span>
                    <input
                      className="ecc-input ecc-input--xs"
                      type="number"
                      placeholder="Max"
                      value={val.max ?? ""}
                      onChange={(e) =>
                        setFilters((fs) => ({
                          ...fs,
                          [k]: {
                            ...((fs[k] as NumberRange) || {}),
                            max:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </th>
              );
            })}
            {actions && <th />}
          </tr>
        </thead>

        <tbody>
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={`sk-${i}`} className="ecc-skeleton-row">
                {columns.map((c, j) => (
                  <td key={String(c.key) + "-" + j}>
                    <div className="ecc-skeleton" />
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="ecc-skeleton ecc-skeleton--sm" />
                  </td>
                )}
              </tr>
            ))}

          {!loading && pageRows.length === 0 && (
            <tr>
              <td className="is-empty" colSpan={columns.length + (actions ? 1 : 0)}>
                No results
              </td>
            </tr>
          )}

          {!loading &&
            pageRows.map((row, idx) => {
              const rid = getRowId?.(row, start + idx) ?? start + idx;
              const clickable = !!onRowClick;
              return (
                <tr
                  key={String(rid)}
                  className={clickable ? "ecc-row--clickable" : undefined}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((c) => {
                    const k = c.key as string;
                    const content =
                      typeof c.render === "function"
                        ? c.render(row)
                        : (getCell(row, k) ?? "—") as React.ReactNode;
                    const tdClass = c.align ? `is-${c.align}` : undefined;
                    return (
                      <td key={k} className={tdClass}>
                        {content}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="is-right" onClick={(e) => e.stopPropagation()}>
                      <details className="ecc-menu">
                        <summary aria-label="Row actions">⋯</summary>
                        <div className="ecc-menu-pop">{actions(row)}</div>
                      </details>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="ecc-table-footer">
        <div className="ecc-footer-left">
          <label className="ecc-page">
            Per page{" "}
            <select
              className="ecc-select ecc-select--sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <span>
            Showing <strong>{Math.min(sorted.length, end)}</strong> of{" "}
            <strong>{sorted.length}</strong>
          </span>
        </div>

        <div className="ecc-footer-right">
          <button
            className="ecc-btn"
            disabled={curPage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <span className="ecc-page">
            {curPage + 1} / {pageCount}
          </span>
          <button
            className="ecc-btn"
            disabled={curPage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;

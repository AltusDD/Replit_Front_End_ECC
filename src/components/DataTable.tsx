import React, {useMemo, useState, useCallback, useEffect} from "react";

/** ===== Column definition (backward compatible) =====
 * Works with your existing columns that look like:
 *   { key: "city", header: "CITY" }
 * It also accepts "accessorKey" or a custom accessor function.
 */
export type ECCColumn<T> = {
  /** Header text */
  header: string;
  /** Property key (dot-path allowed) or accessorKey (TanStack-style) */
  key?: string;
  accessorKey?: string;
  /** Optional custom cell renderer */
  render?: (row: T) => React.ReactNode;
  /** Optional explicit align */
  align?: "left" | "center" | "right";
  /** Sorting mode; true|"alpha"|"numeric"|"date" */
  sort?: boolean | "alpha" | "numeric" | "date";
  /** Per-column filter: "text" | "enum" | "numberRange" | "dateRange"
   * If omitted, we auto-detect from data on first page. */
  filter?: "text" | "enum" | "numberRange" | "dateRange";
  /** Optional width (px or css) */
  width?: number | string;
};

type KPI = { label: string; value: string | number };

export type DataTableProps<T> = {
  title?: string;
  /** Your rows */
  rows: T[];
  /** Your column definitions */
  columns: ECCColumn<T>[];
  /** Optional KPIs (rendered above table) */
  kpis?: KPI[];

  /** Row key function (defaults to row['id'] or index) */
  rowKey?: (row: T, index: number) => string | number;

  /** Link target on click/double-click */
  rowHref?: (row: T) => string;
  /** Click / double-click handlers */
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;

  /** Render trailing actions cell */
  rowActions?: (row: T) => React.ReactNode;

  /** Initial page size; page-size selector sits in the footer */
  defaultPageSize?: number;
  pageSizeOptions?: number[];

  /** Show/Hide global search & CSV export */
  hideGlobalSearch?: boolean;
  hideExport?: boolean;

  /** Compact row density */
  dense?: boolean;
};

/* ---------- small helpers ---------- */

function isNumberLike(v: any) {
  return typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)));
}
function toNumber(v: any): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}
function getByPath(obj: any, path?: string) {
  if (!path) return undefined;
  if (!path.includes(".")) return obj?.[path];
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

/** Attempt to read a column value using several shapes (robust to older code) */
function extractValue<T>(row: T, col: ECCColumn<T>): any {
  if (col.render) return col.render(row);
  if (col.key) return getByPath(row as any, col.key);
  if (col.accessorKey) return getByPath(row as any, col.accessorKey);
  return undefined;
}

type SortState = { index: number; dir: "asc" | "desc" } | null;

function guessFilterKind(sample: any, col: ECCColumn<any>, values: any[]): ECCColumn<any>["filter"] {
  if (col.filter) return col.filter;
  // Prefer number range for numeric columns
  if (values.every(v => v == null || v === "" || isNumberLike(v))) return "numberRange";
  // If few unique strings, treat as enum
  const uniq = Array.from(new Set(values.filter(v => v != null && v !== ""))).slice(0, 30);
  if (uniq.length > 0 && uniq.length <= 10) return "enum";
  return "text";
}

function formatCSVCell(v: any) {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/* ---------- component ---------- */

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    title,
    rows,
    columns,
    kpis = [],
    rowKey,
    rowHref,
    onRowClick,
    onRowDoubleClick,
    rowActions,
    defaultPageSize = 25,
    pageSizeOptions = [25, 50, 100, 150, 200],
    hideGlobalSearch = false,
    hideExport = false,
    dense = false,
  } = props;

  const [global, setGlobal] = useState("");
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortState>(null);

  // Per-column filter state
  type ColFilter =
    | { type: "text"; q: string }
    | { type: "enum"; q: string }
    | { type: "numberRange"; min?: string; max?: string }
    | { type: "dateRange"; min?: string; max?: string };
  const [filters, setFilters] = useState<Record<number, ColFilter>>({});

  // derive sample values to auto-detect filter kinds & alignment
  const firstPageSample = useMemo(() => rows.slice(0, Math.min(rows.length, 50)), [rows]);

  const effectiveCols = useMemo(() => {
    return columns.map((c, idx) => {
      const sampleVals = firstPageSample.map(r => extractValue(r, c));
      const kind = guessFilterKind(sampleVals[0], c, sampleVals);
      const align =
        c.align || (kind === "numberRange" ? "right" : undefined) || (sampleVals.some(v => isNumberLike(v)) ? "right" : "left");
      return { ...c, filter: kind, align } as ECCColumn<T>;
    });
  }, [columns, firstPageSample]);

  // filtering
  const filtered = useMemo(() => {
    let out = rows;

    // global search (case-insensitive, stringified row)
    if (global.trim()) {
      const q = global.trim().toLowerCase();
      out = out.filter(r => {
        for (const c of effectiveCols) {
          const v = extractValue(r, c);
          if (v == null) continue;
          if (String(v).toLowerCase().includes(q)) return true;
        }
        return false;
      });
    }

    // per-column filters
    out = out.filter(r => {
      return effectiveCols.every((c, idx) => {
        const f = filters[idx];
        if (!f) return true;
        const raw = extractValue(r, c);
        switch (f.type) {
          case "text":
            return (raw ?? "").toString().toLowerCase().includes((f.q || "").toLowerCase());
          case "enum":
            if (!f.q || f.q === "All") return true;
            return String(raw ?? "") === f.q;
          case "numberRange": {
            const n = isNumberLike(raw) ? Number(raw) : NaN;
            const minOk = f.min == null || f.min === "" || (!isNaN(n) && n >= Number(f.min));
            const maxOk = f.max == null || f.max === "" || (!isNaN(n) && n <= Number(f.max));
            return minOk && maxOk;
          }
          case "dateRange": {
            const t = raw ? new Date(raw as any).getTime() : NaN;
            const minOk = !f.min || (!isNaN(t) && t >= new Date(f.min).getTime());
            const maxOk = !f.max || (!isNaN(t) && t <= new Date(f.max).getTime());
            return minOk && maxOk;
          }
          default:
            return true;
        }
      });
    });

    // sorting
    if (sort) {
      const c = effectiveCols[sort.index];
      const mode: ECCColumn<T>["sort"] = c.sort ?? "alpha";
      out = [...out].sort((a, b) => {
        const va = extractValue(a, c);
        const vb = extractValue(b, c);
        let cmp = 0;
        if (mode === true || mode === "alpha") {
          cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, { sensitivity: "base", numeric: true });
        } else if (mode === "numeric") {
          cmp = toNumber(va) - toNumber(vb);
        } else if (mode === "date") {
          cmp = new Date(va ?? 0).getTime() - new Date(vb ?? 0).getTime();
        } else {
          cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, { sensitivity: "base", numeric: true });
        }
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return out;
  }, [rows, effectiveCols, filters, sort, global]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);
  const pageRows = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // enum options per column (computed on filtered set for helpful UX)
  const enumOptions: Record<number, string[]> = useMemo(() => {
    const map: Record<number, string[]> = {};
    effectiveCols.forEach((c, idx) => {
      if (c.filter !== "enum") return;
      const s = new Set<string>();
      filtered.forEach(r => {
        const v = extractValue(r, c);
        if (v != null && v !== "") s.add(String(v));
      });
      map[idx] = ["All", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
    });
    return map;
  }, [effectiveCols, filtered]);

  const onHeaderClick = (idx: number) => {
    const c = effectiveCols[idx];
    if (!c.sort) return;
    setSort(prev => {
      if (!prev || prev.index !== idx) return { index: idx, dir: "asc" };
      if (prev.dir === "asc") return { index: idx, dir: "desc" };
      return null;
    });
  };

  // CSV export (current filtered set, all rows)
  const onExport = useCallback(() => {
    const flatCols = effectiveCols.map(c => c.header);
    const lines = [flatCols.join(",")];
    filtered.forEach(r => {
      const line = effectiveCols.map(c => formatCSVCell(extractValue(r, c))).join(",");
      lines.push(line);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title ? title.toLowerCase().replace(/\s+/g, "-") : "export") + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [effectiveCols, filtered, title]);

  const computeRowKey = (row: T, i: number) => {
    if (rowKey) return rowKey(row, i);
    const id = (row as any)?.id ?? (row as any)?.ID ?? (row as any)?.uuid;
    return id ?? i;
    };

  const handleRowClick = (row: T) => {
    if (onRowClick) onRowClick(row);
    else if (rowHref) window.location.assign(rowHref(row));
  };

  const handleRowDouble = (row: T) => {
    if (onRowDoubleClick) onRowDoubleClick(row);
    else if (rowHref) window.location.assign(rowHref(row));
  };

  return (
    <div className="ecc-table-wrap">
      {/* KPIs */}
      {kpis.length > 0 && (
        <div className="ecc-kpis" style={{ marginBottom: 8 }}>
          {kpis.map((k, i) => (
            <div key={i} className="ecc-kpi">
              <div className="ecc-kpi-n">{k.value}</div>
              <div className="ecc-kpi-l">{k.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="ecc-table-toolbar">
        {!hideGlobalSearch && (
          <input
            className="ecc-input"
            placeholder="Search…"
            value={global}
            onChange={e => {
              setGlobal(e.target.value);
              setPage(0);
            }}
          />
        )}
        <div className="ecc-toolbar-spacer" />
        {!hideExport && (
          <button className="ecc-btn" onClick={onExport} title="Export CSV">
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <table className={`ecc-table ${dense ? "is-dense" : ""}`}>
        <thead>
          <tr>
            {effectiveCols.map((c, idx) => {
              const sortable = !!c.sort;
              const cls =
                "is-clickable" +
                (sort?.index === idx ? (sort.dir === "asc" ? " asc" : " desc") : "");
              const thClass = sortable ? cls : undefined;
              const style: React.CSSProperties = { width: typeof c.width === "number" ? `${c.width}px` : c.width };
              return (
                <th key={idx} onClick={() => onHeaderClick(idx)} className={thClass} style={style}>
                  {c.header}
                </th>
              );
            })}
            {rowActions && <th style={{ width: 40 }} />}
          </tr>

          {/* Filter row */}
          <tr>
            {effectiveCols.map((c, idx) => {
              const f = filters[idx];
              const setF = (nf: ColFilter | undefined) =>
                setFilters(prev => {
                  const copy = { ...prev };
                  if (!nf) delete copy[idx];
                  else copy[idx] = nf;
                  // reset page when filtering
                  setPage(0);
                  return copy;
                });

              if (c.filter === "enum") {
                const opts = enumOptions[idx] || ["All"];
                return (
                  <th key={idx}>
                    <select
                      className="ecc-select"
                      value={(f && (f as any).q) || "All"}
                      onChange={e => setF({ type: "enum", q: e.target.value })}
                    >
                      {opts.map(o => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </th>
                );
              }

              if (c.filter === "numberRange" || c.filter === "dateRange") {
                const min = (f as any)?.min || "";
                const max = (f as any)?.max || "";
                const phMin = c.filter === "dateRange" ? "From" : "Min";
                const phMax = c.filter === "dateRange" ? "To" : "Max";
                const type = c.filter === "dateRange" ? "date" : "number";
                return (
                  <th key={idx}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <input
                        className="ecc-input"
                        type={type}
                        placeholder={phMin}
                        value={min}
                        onChange={e => setF({ type: c.filter as any, min: e.target.value, max })}
                      />
                      <input
                        className="ecc-input"
                        type={type}
                        placeholder={phMax}
                        value={max}
                        onChange={e => setF({ type: c.filter as any, min, max: e.target.value })}
                      />
                    </div>
                  </th>
                );
              }

              // default: text filter
              return (
                <th key={idx}>
                  <input
                    className="ecc-input"
                    placeholder="Filter…"
                    value={(f && (f as any).q) || ""}
                    onChange={e => setF({ type: "text", q: e.target.value })}
                  />
                </th>
              );
            })}
            {rowActions && <th />}
          </tr>
        </thead>

        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td className="is-empty" colSpan={effectiveCols.length + (rowActions ? 1 : 0)}>
                No results.
              </td>
            </tr>
          ) : (
            pageRows.map((r, i) => {
              const key = computeRowKey(r, page * pageSize + i);
              return (
                <tr
                  key={key}
                  onClick={() => handleRowClick(r)}
                  onDoubleClick={() => handleRowDouble(r)}
                  className={rowHref || onRowClick || onRowDoubleClick ? "is-row-link" : undefined}
                >
                  {effectiveCols.map((c, idx) => {
                    const v = extractValue(r, c);
                    const style: React.CSSProperties =
                      c.align ? { textAlign: c.align } : isNumberLike(v) ? { textAlign: "right" } : undefined;
                    return (
                      <td key={idx} style={style}>
                        {c.render ? c.render(r) : v ?? "—"}
                      </td>
                    );
                  })}
                  {rowActions && <td style={{ textAlign: "right" }}>{rowActions(r)}</td>}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer / pagination */}
      <div className="ecc-table-footer">
        <div>
          <span className="ecc-page">
            {filtered.length === 0
              ? "0 results"
              : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length}`}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="ecc-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            Prev
          </button>
          <span className="ecc-page">
            {page + 1} / {pageCount}
          </span>
          <button
            className="ecc-btn"
            onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
            disabled={page + 1 >= pageCount}
          >
            Next
          </button>

          {/* page-size selector lives in footer per your request */}
          <select
            className="ecc-select"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            title="Rows per page"
          >
            {pageSizeOptions.map(n => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Also export a named symbol to satisfy any stray named imports.
export { DataTable as DataTable };

/** Notes:
 * - Sticky headers, zebra rows, compact density, gold theme, etc. are in /src/styles/table.css
 * - Double-click is handled (same as click if no explicit onRowDoubleClick provided).
 * - If a column doesn't specify filter/sort, we auto-detect reasonable defaults.
 */

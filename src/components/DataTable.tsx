import React, { useMemo, useState, useRef } from "react";
import "./../styles/table.css";

/** ---------- Types ---------- */
export type SortKind = "string" | "numeric" | ((a: any, b: any) => number) | boolean;
export type FilterKind = "text" | "select" | "numberRange" | "boolean";

export type Column<T> = {
  key: keyof T | string;
  header: React.ReactNode;
  width?: number | string;
  align?: "left" | "right" | "center";
  /** If omitted, sorting is disabled for this column */
  sort?: SortKind;
  /** Cell renderer. If omitted, uses value from `key`. */
  render?: (row: T) => React.ReactNode;
  /** For filtering UI. If omitted, no filter shown for the column. */
  filter?: FilterKind;
  /** Options for `select` kind. If omitted, options are inferred from data. */
  options?: { value: any; label: string }[];
  /** Accessor for raw value used by sort/filter. Defaults to row[key]. */
  accessor?: (row: T) => any;
};

export type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  /** Page size choices in footer */
  pageSizeOptions?: number[];
  /** Initial page size */
  initialPageSize?: number;
  /** Make whole row clickable (optional) */
  rowHref?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
  /** Render trailing actions cell (three dots, etc.) */
  rowActions?: (row: T) => React.ReactNode;
  /** Stable unique id for each row (optional but recommended) */
  getRowId?: (row: T, index: number) => string | number;
  /** Extra className */
  className?: string;
};

/** ---------- Little helpers ---------- */
const fmtMoney = (n: any) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })
    : "—";
const fmtPercent = (n: any) =>
  typeof n === "number" ? `${(n as number).toFixed(1)}%` : "—";
const fmtDate = (s: any) =>
  s ? new Date(s).toISOString().slice(0, 10) : "—";

const Badge: React.FC<{ kind?: "ok" | "warn" | "bad" | "muted"; children?: React.ReactNode }> = ({
  kind = "muted",
  children,
}) => <span className={`ecc-badge ${kind ? `ecc-badge--${kind}` : ""}`}>{children}</span>;

const OccupancyPill: React.FC<{ value?: number | null }> = ({ value }) => {
  if (value == null || isNaN(value)) return <span>—</span>;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ecc-occ">
      <div className="ecc-occ__bar" style={{ width: `${pct}%` }} />
      <span className="ecc-occ__label">{pct.toFixed(1)}%</span>
    </div>
  );
};

/** ---------- Component ---------- */
export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    rows,
    columns,
    pageSizeOptions = [25, 50, 100, 200],
    initialPageSize = 25,
    rowHref,
    onRowClick,
    rowActions,
    getRowId,
    className,
  } = props;

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // filter state per column
  type FilterState =
    | { kind: "text"; v: string }
    | { kind: "select"; v: string }
    | { kind: "numberRange"; min?: string; max?: string }
    | { kind: "boolean"; v: "all" | "true" | "false" };
  const [filters, setFilters] = useState<Record<string, FilterState>>({});

  // infer options for select filters when not provided
  const inferredOptions = useMemo(() => {
    const map: Record<string, { value: any; label: string }[]> = {};
    columns.forEach((c) => {
      if (c.filter === "select" && !c.options) {
        const key = String(c.key);
        const set = new Set<any>();
        rows.forEach((r) => {
          const val = (c.accessor ? c.accessor(r) : (r as any)[key]);
          if (val != null && val !== "") set.add(val);
        });
        map[key] = Array.from(set).slice(0, 1000).map((v) => ({ value: v, label: String(v) }));
      }
    });
    return map;
  }, [columns, rows]);

  // filtering
  const filtered = useMemo(() => {
    return rows.filter((row) => {
      for (const col of columns) {
        const f = filters[String(col.key)];
        if (!f) continue;
        const raw = col.accessor ? col.accessor(row) : (row as any)[String(col.key)];

        if (f.kind === "text") {
          if (!String(raw ?? "").toLowerCase().includes(f.v.toLowerCase())) return false;
        } else if (f.kind === "select") {
          if (f.v && f.v !== "all" && String(raw ?? "") !== f.v) return false;
        } else if (f.kind === "numberRange") {
          const n = typeof raw === "number" ? raw : raw == null || raw === "" ? NaN : Number(raw);
          if (f.min && !isNaN(Number(f.min)) && !(n >= Number(f.min))) return false;
          if (f.max && !isNaN(Number(f.max)) && !(n <= Number(f.max))) return false;
        } else if (f.kind === "boolean") {
          if (f.v === "true" && !raw) return false;
          if (f.v === "false" && !!raw) return false;
        }
      }
      return true;
    });
  }, [rows, columns, filters]);

  // sorting
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => String(c.key) === sortKey);
    if (!col || !col.sort) return filtered;

    const kind = col.sort;
    const acc = (r: T) => (col.accessor ? col.accessor(r) : (r as any)[sortKey]);

    const cmp =
      kind === "numeric"
        ? (a: T, b: T) => (Number(acc(a)) || 0) - (Number(acc(b)) || 0)
        : kind === "string" || kind === true
        ? (a: T, b: T) => String(acc(a) ?? "").localeCompare(String(acc(b) ?? ""))
        : typeof kind === "function"
        ? kind
        : () => 0;

    const out = [...filtered].sort(cmp as any);
    return sortDir === "asc" ? out : out.reverse();
  }, [filtered, columns, sortKey, sortDir]);

  // pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = useMemo(
    () => sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [sorted, currentPage, pageSize]
  );

  // header handlers
  const onClickHeader = (key: string, sortable: SortKind | undefined) => {
    if (!sortable) return;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  // filter inputs
  const renderFilter = (col: Column<T>) => {
    const key = String(col.key);
    if (!col.filter) return <span />;

    if (col.filter === "text") {
      const v = (filters[key] as any)?.v ?? "";
      return (
        <input
          className="ecc-filter ecc-input"
          placeholder="Filter…"
          value={v}
          onChange={(e) => setFilters((s) => ({ ...s, [key]: { kind: "text", v: e.target.value } }))}
        />
      );
    }
    if (col.filter === "select") {
      const v = (filters[key] as any)?.v ?? "all";
      const opts = col.options ?? inferredOptions[key] ?? [];
      return (
        <select
          className="ecc-filter ecc-select"
          value={v}
          onChange={(e) => setFilters((s) => ({ ...s, [key]: { kind: "select", v: e.target.value } }))}
        >
          <option value="all">All</option>
          {opts.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    if (col.filter === "numberRange") {
      const st = (filters[key] as any) ?? {};
      return (
        <div className="ecc-range">
          <input
            className="ecc-filter ecc-input"
            placeholder="Min"
            value={st.min ?? ""}
            onChange={(e) =>
              setFilters((s) => ({ ...s, [key]: { kind: "numberRange", min: e.target.value, max: st.max } }))
            }
          />
          <input
            className="ecc-filter ecc-input"
            placeholder="Max"
            value={st.max ?? ""}
            onChange={(e) =>
              setFilters((s) => ({ ...s, [key]: { kind: "numberRange", min: st.min, max: e.target.value } }))
            }
          />
        </div>
      );
    }
    if (col.filter === "boolean") {
      const v = (filters[key] as any)?.v ?? "all";
      return (
        <select
          className="ecc-filter ecc-select"
          value={v}
          onChange={(e) => setFilters((s) => ({ ...s, [key]: { kind: "boolean", v: e.target.value as any } }))}
        >
          <option value="all">All</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }
    return <span />;
  };

  const onClickRow = (row: T) => {
    if (onRowClick) onRowClick(row);
    const href = rowHref?.(row);
    if (href) window.location.assign(href);
  };

  return (
    <div className={`ecc-table-wrap ${className || ""}`}>
      <table className="ecc-table">
        <thead>
          <tr>
            {columns.map((c) => {
              const key = String(c.key);
              const sortable = !!c.sort;
              const cls =
                "th" +
                (sortable ? " is-clickable" : "") +
                (sortKey === key ? ` ${sortDir === "asc" ? "asc" : "desc"}` : "");
              return (
                <th
                  key={key}
                  className={cls}
                  style={{ width: c.width, textAlign: c.align ?? "left" }}
                  onClick={() => onClickHeader(key, c.sort)}
                >
                  {c.header}
                </th>
              );
            })}
            {rowActions && <th className="th" style={{ width: 40, textAlign: "center" }}>⋯</th>}
          </tr>
          {/* filter row */}
          <tr>
            {columns.map((c) => (
              <th key={`f-${String(c.key)}`} className="th-filter" style={{ textAlign: c.align ?? "left" }}>
                {renderFilter(c)}
              </th>
            ))}
            {rowActions && <th />}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, i) => {
            const rid = getRowId ? getRowId(row, i) : i;
            const clickable = !!rowHref || !!onRowClick;
            return (
              <tr
                key={rid}
                className={clickable ? "is-clickable" : undefined}
                onClick={() => clickable && onClickRow(row)}
              >
                {columns.map((c) => {
                  const key = String(c.key);
                  const raw = c.accessor ? c.accessor(row) : (row as any)[key];
                  const content = c.render ? c.render(row) : raw ?? "—";
                  const align = c.align ?? "left";
                  return (
                    <td key={`${rid}-${key}`} className={align === "right" ? "is-right" : align === "center" ? "is-center" : ""}>
                      {content}
                    </td>
                  );
                })}
                {rowActions && <td className="is-center" onClick={(e) => e.stopPropagation()}>{rowActions(row)}</td>}
              </tr>
            );
          })}
          {paged.length === 0 && (
            <tr>
              <td className="is-empty" colSpan={columns.length + (rowActions ? 1 : 0)}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer / Pager */}
      <div className="ecc-table-footer">
        <div className="ecc-page">
          <button className="ecc-btn" disabled={currentPage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Prev
          </button>
          <span style={{ margin: "0 8px" }}>
            Page {currentPage + 1} / {pageCount} • {total} results
          </span>
          <button
            className="ecc-btn"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Next
          </button>
        </div>
        <div>
          <label style={{ marginRight: 6, color: "var(--ink-3)" }}>Rows/page</label>
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
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/** Re-export simple helpers in case pages want them */
export const Format = { money: fmtMoney, percent: fmtPercent, date: fmtDate, Badge, OccupancyPill };

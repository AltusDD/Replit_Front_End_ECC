// src/components/ui/Table.tsx
import React, { useMemo, useState } from "react";

export type Col<T> = {
  /** key into row or arbitrary id when using render */
  key: keyof T | string;
  label: string;
  width?: number | string;
  /** custom cell renderer — takes the row, returns node */
  render?: (row: T) => React.ReactNode;
  /** optional custom sorter — (a,b) => number */
  sort?: (a: T, b: T) => number;
};

export type TableProps<T> = {
  rows: T[];
  cols: Col<T>[];
  cap?: string;          // caption text below the table
  empty?: string;        // message for empty state
};

type Dir = "asc" | "desc";

function defaultSort<T>(a: any, b: any): number {
  // normalize primitives and dates
  const av = a ?? "";
  const bv = b ?? "";
  if (av === bv) return 0;
  if (typeof av === "number" && typeof bv === "number") return av - bv;
  // Date instance or ISO string
  const ad = new Date(av);
  const bd = new Date(bv);
  if (!isNaN(ad.valueOf()) && !isNaN(bd.valueOf())) return ad.getTime() - bd.getTime();
  return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
}

export default function Table<T extends Record<string, any>>({
  rows,
  cols,
  cap,
  empty = "No results",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string>(String(cols[0]?.key ?? ""));
  const [dir, setDir] = useState<Dir>("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = cols.find((c) => String(c.key) === sortKey);
    const sorter =
      col?.sort ??
      ((a: T, b: T) => defaultSort(a[sortKey as keyof T], b[sortKey as keyof T]));
    const out = [...rows].sort(sorter);
    return dir === "asc" ? out : out.reverse();
  }, [rows, cols, sortKey, dir]);

  const onSort = (k: string) => {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setDir("asc");
    }
  };

  const Indicator = ({ k }: { k: string }) =>
    sortKey === k ? <span style={{ marginLeft: 6, color: "var(--ink-3)" }}>{dir === "asc" ? "▲" : "▼"}</span> : null;

  return (
    <div className="panel" style={{ padding: 12 }}>
      <table className="table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={String(c.key)}
                style={{ width: c.width }}
                onClick={() => onSort(String(c.key))}
              >
                <span style={{ cursor: "pointer", userSelect: "none", color: "var(--color-text-secondary)" }}>
                  {c.label}
                  <Indicator k={String(c.key)} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={cols.length} style={{ padding: 16, color: "var(--color-text-muted)" }}>
                {empty}
              </td>
            </tr>
          ) : (
            sorted.map((r, idx) => (
              <tr key={(r as any).id ?? idx}>
                {cols.map((c) => (
                  <td key={String(c.key)}>
                    {c.render ? c.render(r) : String(r[c.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {cap && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-muted)" }}>
          {cap}
        </div>
      )}
    </div>
  );
}

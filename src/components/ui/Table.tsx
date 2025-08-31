import React, { useMemo, useState } from "react";

type Col<T> = {
  key?: keyof T | string;                // data key for plain access
  label: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;  // custom cell
  sortKey?: (row: T) => any;             // custom sort accessor (falls back to key)
};

function valAt(obj: any, key?: string | number) {
  if (obj == null) return undefined;
  if (!key) return undefined;
  if (typeof key === "string" && key.includes(".")) {
    return key.split(".").reduce((a: any, k: string) => (a ? a[k] : undefined), obj);
  }
  // @ts-ignore
  return obj[key as any];
}

function cmp(a: any, b: any) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // Date strings?
  const ad = Date.parse(a), bd = Date.parse(b);
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;

  // Numbers?
  const an = typeof a === "number" ? a : Number(a);
  const bn = typeof b === "number" ? b : Number(b);
  const aNum = !Number.isNaN(an);
  const bNum = !Number.isNaN(bn);
  if (aNum && bNum) return an - bn;

  // Fallback: locale string compare
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function sortRows<T>(rows: T[], col?: Col<T>, dir: "asc" | "desc" = "asc") {
  if (!col) return rows;
  const get = (r: T) => (col.sortKey ? col.sortKey(r) : (col.key ? valAt(r as any, col.key as any) : undefined));
  const mult = dir === "asc" ? 1 : -1;
  return [...rows].sort((ra, rb) => mult * cmp(get(ra), get(rb)));
}

export default function Table<T extends Record<string, any>>(
  { rows, cols, empty = "No results", cap }: { rows: T[]; cols: Col<T>[]; empty?: string; cap?: string }
) {
  const [sortIdx, setSortIdx] = useState<number | null>(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const activeCol = sortIdx != null ? cols[sortIdx] : undefined;
  const sorted = useMemo(() => sortRows(rows, activeCol, sortDir), [rows, sortIdx, sortDir]);

  function onSort(i: number) {
    if (sortIdx === i) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortIdx(i); setSortDir("asc"); }
  }

  return (
    <div className="panel" style={{ padding: 12 }}>
      {cap ? <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{cap}</div> : null}
      <table className="table">
        <thead>
          <tr>
            {cols.map((c, i) => {
              const is = i === sortIdx;
              const arrow = is ? (sortDir === "asc" ? " ▲" : " ▼") : "";
              return (
                <th key={i} style={{ width: c.width }}>
                  <button
                    onClick={() => onSort(i)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      color: "var(--color-text-primary)"
                    }}
                    title="Sort"
                  >
                    {c.label}{arrow}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td>{empty}</td></tr>
          ) : (
            sorted.map((r, ri) => (
              <tr key={ri}>
                {cols.map((c, ci) => {
                  const v = c.render ? c.render(r) : (c.key ? valAt(r, c.key) : "");
                  return <td key={ci}>{v != null && v !== "" ? String(v) : "—"}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

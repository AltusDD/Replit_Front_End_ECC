import React, { useMemo, useRef, useState } from "react";
import { useAllProperties } from "../../lib/ecc-resolvers";
import { BLANK, formatPercent } from "@/lib/format";
import CanonicalDenseTableShell from "@/features/command-surface/CanonicalDenseTableShell";
import EccCommandPalette from "@/features/command-surface/EccCommandPalette";
import TriageBoardShell from "@/features/command-surface/TriageBoardShell";
import { PropertyCommandRow } from "@/features/command-surface/types";

export default function Properties() {
  const [q, setQ] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isFetching, error } = useAllProperties();

  const rows = useMemo(() => {
    if (!data) return [];
    
    // Map API data to table format
    const mapped: PropertyCommandRow[] = data.map((prop: any) => ({
      id: String(prop.id),
      name: prop.name ?? prop.label ?? `Property ${prop.id}`,
      address: [prop.street_1, prop.city, prop.state].filter(Boolean).join(", ") ?? BLANK,
      units: prop.units !== null && prop.units !== undefined ? prop.units : 0,
      occupancy: prop.occupancy_pct ? formatPercent(prop.occupancy_pct, 0, "percent") : BLANK,
      market: prop.city ?? prop.state ?? BLANK
    }));

    // Apply search filter
    const t = q.trim().toLowerCase();
    if (!t) return mapped;
    return mapped.filter(r =>
      r.name.toLowerCase().includes(t) ||
      r.address.toLowerCase().includes(t) ||
      r.id.toLowerCase().includes(t) ||
      r.market.toLowerCase().includes(t)
    );
  }, [data, q]);
  const selectedRows = rows.filter((row) => selectedIds.includes(row.id));

  return (
    <section className="ecc-page">
      <div className="ecc-command-surface-layout">
        <div>
          <EccCommandPalette onFocusPropertiesSearch={() => searchInputRef.current?.focus()} />
          <CanonicalDenseTableShell
            rows={rows}
            loading={isLoading || (isFetching && rows.length === 0)}
            error={error ? String(error) : undefined}
            search={q}
            onSearchChange={setQ}
            searchInputRef={searchInputRef}
            selectedIds={selectedIds}
            onSelectionChange={(ids) => setSelectedIds(Array.from(new Set(ids)))}
          />
        </div>
        <TriageBoardShell items={selectedRows} />
      </div>
    </section>
  );
}

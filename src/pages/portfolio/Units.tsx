import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";
import { useAllUnits } from "../../lib/ecc-resolvers";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

type UnitRow = {
  id: string;
  property: string;
  unit: string;
  beds: number;
  baths: number;
  status: "Occupied" | "Vacant" | "Notice";
  rent: string;
};

export default function Units() {
  const [q, setQ] = useState("");
  const { data, isLoading, isFetching, error } = useAllUnits();

  const rows = useMemo(() => {
    if (!data) return [];
    
    // Map API data to table format
    const mapped: UnitRow[] = data.map((unit: any) => ({
      id: String(unit.id),
      property: unit.property_name ?? BLANK,
      unit: unit.label ?? unit.unit_number ?? `Unit ${unit.id}`,
      beds: unit.beds !== null && unit.beds !== undefined ? unit.beds : 0,
      baths: unit.baths !== null && unit.baths !== undefined ? unit.baths : 0,
      status: unit.status ?? "Vacant",
      rent: unit.market_rent_cents ? formatCurrencyFromCents(unit.market_rent_cents) : BLANK
    }));

    // Apply search filter
    const t = q.trim().toLowerCase();
    if (!t) return mapped;
    return mapped.filter(r =>
      r.property.toLowerCase().includes(t) ||
      r.unit.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [data, q]);

  const columns: Column<UnitRow>[] = [
    { key: "unit", header: "Unit", width: 100 },
    { key: "property", header: "Property" },
    { key: "beds", header: "Beds", width: 80 },
    { key: "baths", header: "Baths", width: 90 },
    { key: "status", header: "Status", width: 120 },
    { key: "rent", header: "Market Rent", width: 140 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar 
        title="Units" 
        value={q} 
        onChange={setQ} 
        placeholder="Search units / property / status" 
      />
      <DataTable 
        columns={columns} 
        rows={rows} 
        loading={isLoading || (isFetching && rows.length === 0)}
        error={error ? String(error) : undefined}
        rowHref={(r) => `/card/unit/${r.id}`}
        getRowId={(r) => r.id}
      />
    </section>
  );
}
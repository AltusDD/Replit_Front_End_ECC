import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";
import { useAllProperties } from "../../lib/ecc-resolvers";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

type PropertyRow = {
  id: string;
  name: string;
  address: string;
  units: number;
  occupancy: string; // "94%" etc
  market: string; // region/metro
};

export default function Properties() {
  const [q, setQ] = useState("");
  const { data, isLoading, isFetching, error } = useAllProperties();

  const rows = useMemo(() => {
    if (!data) return [];
    
    // Map API data to table format
    const mapped: PropertyRow[] = data.map((prop: any) => ({
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

  const columns: Column<PropertyRow>[] = [
    { key: "id", header: "ID", width: 110 },
    { key: "name", header: "Property" },
    { key: "address", header: "Address" },
    { key: "units", header: "Units", width: 90 },
    { key: "occupancy", header: "Occupancy", width: 120 },
    { key: "market", header: "Market", width: 140 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar 
        title="Properties" 
        value={q} 
        onChange={setQ} 
        createLabel="Add Property" 
        onCreate={() => alert("Create Property")} 
      />
      <DataTable 
        columns={columns} 
        rows={rows} 
        loading={isLoading || (isFetching && rows.length === 0)}
        error={error ? String(error) : undefined}
        rowHref={(r) => `/card/property/${r.id}`}
        getRowId={(r) => r.id}
      />
    </section>
  );
}
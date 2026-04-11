import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";
import { useAllProperties } from "../../lib/ecc-resolvers";
import { formatNumber, formatPercent, BLANK } from "@/lib/format";
import KpiStrip from "@/components/analytics/KpiStrip";
import ActiveFilterSummary from "@/components/analytics/ActiveFilterSummary";

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

  const occupancyAverage = useMemo(() => {
    if (!data || data.length === 0) return null;
    const numeric = data
      .map((prop: any) => Number(prop.occupancy_pct))
      .filter((value: number) => Number.isFinite(value));
    if (numeric.length === 0) return null;
    return numeric.reduce((sum: number, value: number) => sum + value, 0) / numeric.length;
  }, [data]);

  const rankedMarkets = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((row) => {
      if (!row.market || row.market === BLANK) return;
      counts.set(row.market, (counts.get(row.market) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)
      .map(([market, count]) => `${market} (${count})`)[0] ?? BLANK;
  }, [rows]);

  const propertyMetrics = [
    { key: "visible_properties", label: "Visible Properties", value: formatNumber(rows.length), helper: "Current property rows after applying the live table search scope." },
    { key: "portfolio_total", label: "Portfolio Total", value: formatNumber(data?.length ?? 0), helper: "Total properties returned from the portfolio resolver before search narrowing." },
    { key: "avg_occupancy", label: "Avg Occupancy", value: occupancyAverage !== null ? formatPercent(occupancyAverage, 0, "percent") : BLANK, helper: "Average occupancy across properties currently loaded into the table." },
    { key: "top_market", label: "Top Market", value: rankedMarkets, helper: "Most represented market inside the current visible property slice." },
  ];

  const activeSummary = [
    { key: "search", label: "Search", value: q.trim() || "All properties" },
    { key: "results", label: "Results", value: `${rows.length}/${data?.length ?? 0}` },
    { key: "scope", label: "Scope", value: "Property table" },
    { key: "drilldown", label: "Drill-down", value: "Property card route" },
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
      <div className="space-y-4 pb-4">
        <KpiStrip title="Portfolio Metric Rail" items={propertyMetrics} />
        <ActiveFilterSummary title="Active Property Scope" items={activeSummary} />
      </div>
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

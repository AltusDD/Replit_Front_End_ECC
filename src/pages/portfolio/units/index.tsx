import React, { useMemo } from "react";
import { useCollection } from "../../../lib/useApi";
import Table from "../../../components/ui/Table";

function pick(obj: any, keys: string[], fallback: any = "—") {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
}

export default function UnitsPage() {
  const { data = [], loading, error } = useCollection("units", { limit: 1000 });

  const cols = useMemo(
    () => [
      { label: "id", key: "id", width: 110, render: (r: any) => String(pick(r, ["id", "uuid", "_id"], "—")) },
      { label: "property", key: "property", width: 260, render: (r: any) => pick(r, ["property_name", "property", "building"], "—") },
      { label: "unit", key: "unit", width: 110, render: (r: any) => pick(r, ["unit", "unit_number", "name"], "—") },
      { label: "beds", key: "beds", width: 80, render: (r: any) => pick(r, ["beds", "bedrooms"], "—") },
      { label: "baths", key: "baths", width: 80, render: (r: any) => pick(r, ["baths", "bathrooms"], "—") },
      { label: "sqft", key: "sqft", width: 100, render: (r: any) => pick(r, ["sqft", "square_feet"], "—") },
      { label: "status", key: "status", width: 120, render: (r: any) => pick(r, ["status", "availability"], "—") },
      { label: "market_rent", key: "market_rent", width: 140, render: (r: any) => pick(r, ["market_rent", "rent"], "—") },
    ],
    []
  );

  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Units</h1>
      {error && <div className="panel">API error: {String(error)}</div>}
      <div className="panel">
        <Table rows={data} cols={cols} loading={loading} />
      </div>
      <div className="ecc-footnote">Loaded {data.length} units</div>
    </section>
  );
}

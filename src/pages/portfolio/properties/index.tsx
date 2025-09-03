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

export default function PropertiesPage() {
  const { data = [], loading, error } = useCollection("properties", { limit: 500 });

  const cols = useMemo(
    () => [
      { label: "id", key: "id", width: 110, render: (r: any) => String(pick(r, ["id", "uuid", "_id"], "—")) },
      { label: "doorloop_id", key: "doorloop_id", width: 120, render: (r: any) => pick(r, ["doorloop_id", "external_id"], "—") },
      { label: "name", key: "name", width: 260, render: (r: any) => pick(r, ["display_name", "name"], "—") },
      { label: "type", key: "type", width: 120, render: (r: any) => pick(r, ["type", "asset_type"], "—") },
      { label: "class", key: "class", width: 100, render: (r: any) => pick(r, ["class", "asset_class"], "—") },
      { label: "active", key: "active", width: 90, render: (r: any) => (pick(r, ["active", "is_active"], false) ? "Yes" : "No") },
      { label: "address_street1", key: "address_street1", width: 280, render: (r: any) => pick(r, ["address_street1", "address1", "address"], "—") },
      { label: "city", key: "city", width: 140, render: (r: any) => pick(r, ["city"], "—") },
      { label: "state", key: "state", width: 80, render: (r: any) => pick(r, ["state", "region"], "—") },
      { label: "units", key: "units", width: 90, render: (r: any) => pick(r, ["units", "unit_count"], "—") },
      { label: "occupancy", key: "occupancy", width: 120, render: (r: any) => pick(r, ["occupancy", "occ_rate"], "—") },
    ],
    []
  );

  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Properties</h1>
      {error && <div className="panel">API error: {String(error)}</div>}
      <div className="panel">
        <Table rows={data} cols={cols} loading={loading} />
      </div>
      <div className="ecc-footnote">Loaded {data.length} properties</div>
    </section>
  );
}

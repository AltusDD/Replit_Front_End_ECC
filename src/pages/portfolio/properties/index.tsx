import React from "react";
import { SimpleTable } from "@/components/Table";
import { mapProperty, PROPERTY_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function PropertiesPage() {
  const { data = [], loading, error } = useCollection("properties");
  const rows = (data || []).map(mapProperty);

  return (
    <>
      <h1>Properties</h1>
      {error && <div style={{ color: "tomato" }}>Error: {String(error)}</div>}
      <SimpleTable
        columns={PROPERTY_COLUMNS}
        rows={rows}
        empty={loading ? "Loading…" : "No properties"}
      />
    </>
  );
}

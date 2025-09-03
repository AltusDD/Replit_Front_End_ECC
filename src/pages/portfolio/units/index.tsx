import React from "react";
import { SimpleTable } from "@/components/Table";
import { mapUnit, UNIT_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function UnitsPage() {
  const { data = [], loading, error } = useCollection("units");
  const rows = (data || []).map(mapUnit);

  return (
    <>
      <h1>Units</h1>
      {error && <div style={{ color: "tomato" }}>Error: {String(error)}</div>}
      <SimpleTable
        columns={UNIT_COLUMNS}
        rows={rows}
        empty={loading ? "Loading…" : "No units"}
      />
    </>
  );
}

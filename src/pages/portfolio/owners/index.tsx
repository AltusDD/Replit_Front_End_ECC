import React from "react";
import { SimpleTable } from "@/components/Table";
import { mapOwner, OWNER_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function OwnersPage() {
  const { data = [], loading, error } = useCollection("owners");
  const rows = (data || []).map(mapOwner);

  return (
    <>
      <h1>Owners</h1>
      {error && <div style={{ color: "tomato" }}>Error: {String(error)}</div>}
      <SimpleTable
        columns={OWNER_COLUMNS}
        rows={rows}
        empty={loading ? "Loading…" : "No owners"}
      />
    </>
  );
}

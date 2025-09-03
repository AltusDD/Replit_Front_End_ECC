import React from "react";
import { SimpleTable } from "@/components/Table";
import { mapLease, LEASE_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function LeasesPage() {
  const { data = [], loading, error } = useCollection("leases");
  const rows = (data || []).map(mapLease);

  return (
    <>
      <h1>Leases</h1>
      {error && <div style={{ color: "tomato" }}>Error: {String(error)}</div>}
      <SimpleTable
        columns={LEASE_COLUMNS}
        rows={rows}
        empty={loading ? "Loading…" : "No leases"}
      />
    </>
  );
}

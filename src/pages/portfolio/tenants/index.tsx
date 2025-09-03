import React from "react";
import { SimpleTable } from "@/components/Table";
import { mapTenant, TENANT_COLUMNS } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function TenantsPage() {
  const { data = [], loading, error } = useCollection("tenants");
  const rows = (data || []).map(mapTenant);

  return (
    <>
      <h1>Tenants</h1>
      {error && <div style={{ color: "tomato" }}>Error: {String(error)}</div>}
      <SimpleTable
        columns={TENANT_COLUMNS}
        rows={rows}
        empty={loading ? "Loading…" : "No tenants"}
      />
    </>
  );
}

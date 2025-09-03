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

export default function TenantsPage() {
  const { data = [], loading, error } = useCollection("tenants", { limit: 1000 });

  const cols = useMemo(
    () => [
      { label: "id", key: "id", width: 120, render: (r: any) => pick(r, ["id", "tenant_id"], "—") },
      { label: "name", key: "name", width: 220, render: (r: any) => pick(r, ["name", "full_name", "display_name"], "—") },
      { label: "property", key: "property", width: 240, render: (r: any) => pick(r, ["property_name", "property"], "—") },
      { label: "unit", key: "unit", width: 110, render: (r: any) => pick(r, ["unit", "unit_number"], "—") },
      { label: "email", key: "email", width: 240, render: (r: any) => pick(r, ["email", "primary_email"], "—") },
      { label: "phone", key: "phone", width: 160, render: (r: any) => pick(r, ["phone", "phone_number", "mobile"], "—") },
      { label: "status", key: "status", width: 120, render: (r: any) => pick(r, ["status"], "—") },
      { label: "balance", key: "balance", width: 120, render: (r: any) => pick(r, ["balance", "amount_due"], "—") },
    ],
    []
  );

  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Tenants</h1>
      {error && <div className="panel">API error: {String(error)}</div>}
      <div className="panel">
        <Table rows={data} cols={cols} loading={loading} />
      </div>
      <div className="ecc-footnote">Loaded {data.length} tenants</div>
    </section>
  );
}

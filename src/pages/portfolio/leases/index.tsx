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

const fmtDate = (v: any) => (v ? new Date(v).toLocaleDateString() : "—");

export default function LeasesPage() {
  const { data = [], loading, error } = useCollection("leases", { limit: 1000 });

  const cols = useMemo(
    () => [
      { label: "id", key: "id", width: 150, render: (r: any) => pick(r, ["id", "lease_id"], "—") },
      {
        label: "tenant",
        key: "tenant",
        width: 220,
        render: (r: any) => {
          const t = pick(r, ["tenant", "tenant_name"], null);
          const ts = pick(r, ["tenants", "tenant_list"], null);
          if (Array.isArray(ts) && ts.length) return ts.map((x: any) => x?.name || x).join(", ");
          return t ?? "—";
        },
      },
      { label: "property", key: "property", width: 240, render: (r: any) => pick(r, ["property_name", "property"], "—") },
      { label: "rent", key: "rent", width: 120, render: (r: any) => pick(r, ["rent", "monthly_rent", "amount"], "—") },
      { label: "start", key: "start", width: 120, render: (r: any) => fmtDate(pick(r, ["start", "start_date", "commencement"])) },
      { label: "end", key: "end", width: 120, render: (r: any) => fmtDate(pick(r, ["end", "end_date", "expiration"])) },
      { label: "status", key: "status", width: 120, render: (r: any) => pick(r, ["status"], "—") },
    ],
    []
  );

  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Leases</h1>
      {error && <div className="panel">API error: {String(error)}</div>}
      <div className="panel">
        <Table rows={data} cols={cols} loading={loading} />
      </div>
      <div className="ecc-footnote">Loaded {data.length} leases</div>
    </section>
  );
}

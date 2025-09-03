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

export default function OwnersPage() {
  const { data = [], loading, error } = useCollection("owners", { limit: 500 });

  const cols = useMemo(
    () => [
      { label: "id", key: "id", width: 120, render: (r: any) => pick(r, ["id", "owner_id"], "—") },
      { label: "name", key: "name", width: 260, render: (r: any) => pick(r, ["name", "entity_name", "display_name"], "—") },
      {
        label: "portfolio_size",
        key: "portfolio_size",
        width: 140,
        render: (r: any) => {
          const n = pick(r, ["portfolio_size"], null);
          const arr = r?.properties;
          if (n != null) return n;
          if (Array.isArray(arr)) return arr.length;
          return "—";
        },
      },
      { label: "email", key: "email", width: 240, render: (r: any) => pick(r, ["email", "primary_email"], "—") },
      { label: "phone", key: "phone", width: 160, render: (r: any) => pick(r, ["phone", "phone_number"], "—") },
    ],
    []
  );

  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Owners</h1>
      {error && <div className="panel">API error: {String(error)}</div>}
      <div className="panel">
        <Table rows={data} cols={cols} loading={loading} />
      </div>
      <div className="ecc-footnote">Loaded {data.length} owners</div>
    </section>
  );
}

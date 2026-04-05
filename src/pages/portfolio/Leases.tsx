import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";
import { useAllLeases } from "../../lib/ecc-resolvers";
import { BLANK, formatCurrencyFromCents } from "@/lib/format";

type Lease = {
  id: string | number;
  property_name?: string;
  propertyName?: string;
  unit_label?: string;
  unitLabel?: string;
  primary_tenant_name?: string;
  tenant_name?: string;
  tenant_names?: string[];
  tenants?: string[];
  rent?: number;
  rent_cents?: number;
  start_date?: string;
  start?: string;
  end_date?: string;
  end?: string;
  status?: string;
};

type Row = {
  id: string;
  tenants: string;
  property: string;
  unit: string;
  rent: number;
  start: string;
  end: string;
  status: string;
};

export default function LeasesPage() {
  const [q, setQ] = useState("");
  const { data, isLoading, isFetching, error } = useAllLeases();

  const rows: Row[] = useMemo(() => {
    if (!data) return [];

    const mapped = data.map((lease: Lease) => {
      const tenantList =
        Array.isArray(lease.tenant_names) && lease.tenant_names.length > 0
          ? lease.tenant_names
          : Array.isArray(lease.tenants) && lease.tenants.length > 0
            ? lease.tenants
            : [lease.primary_tenant_name, lease.tenant_name].filter(Boolean);

      const rent =
        typeof lease.rent === "number"
          ? lease.rent
          : typeof lease.rent_cents === "number"
            ? Math.round(lease.rent_cents) / 100
            : 0;

      return {
        id: String(lease.id),
        tenants: tenantList.join(", ") || "No tenant assigned",
        property: lease.property_name ?? lease.propertyName ?? BLANK,
        unit: lease.unit_label ?? lease.unitLabel ?? BLANK,
        rent,
        start: lease.start_date ?? lease.start ?? "",
        end: lease.end_date ?? lease.end ?? "",
        status: lease.status ?? "unknown",
      };
    });

    const search = q.trim().toLowerCase();
    if (!search) return mapped;

    return mapped.filter((row) =>
      row.tenants.toLowerCase().includes(search) ||
      row.property.toLowerCase().includes(search) ||
      row.unit.toLowerCase().includes(search) ||
      row.status.toLowerCase().includes(search),
    );
  }, [data, q]);

  // KPIs
  const total = rows.length;
  const active = rows.filter((r) => r.status.toLowerCase() === "active");
  const ended = rows.filter((r) => r.status.toLowerCase() === "ended");
  const mrr = active.reduce((s, r) => s + (Number.isFinite(Number(r.rent)) ? Number(r.rent) : 0), 0);
  const avg = rows.length
    ? rows.reduce((s, r) => s + (Number.isFinite(Number(r.rent)) ? Number(r.rent) : 0), 0) / rows.length
    : 0;

  // Columns
  const columns: Column<Row>[] = [
    { key: "tenants", header: "TENANT(S)" },
    { key: "property", header: "PROPERTY" },
    { key: "unit", header: "UNIT", width: 110 },
    {
      key: "rent",
      header: "RENT",
      className: "is-right",
      render: (r) => formatCurrencyFromCents(Math.round(r.rent * 100)),
      sort: (a, b) => (Number.isFinite(Number(a.rent)) ? Number(a.rent) : 0) - (Number.isFinite(Number(b.rent)) ? Number(b.rent) : 0),
    },
    { key: "start", header: "START" },
    { key: "end", header: "END" },
    { key: "status", header: "STATUS" },
  ];

  return (
    <section className="ecc-page">
      <FilterBar
        title="Leases"
        value={q}
        onChange={setQ}
        placeholder="Search tenant / property / unit / status"
      />
      {/* KPI strip (styled by .ecc-kpis in table.css) */}
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{total.toLocaleString()}</div>
          <div className="ecc-kpi-l">LEASES</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{active.length.toLocaleString()}</div>
          <div className="ecc-kpi-l">ACTIVE</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{ended.length.toLocaleString()}</div>
          <div className="ecc-kpi-l">ENDED</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{formatCurrencyFromCents(Math.round(mrr * 100))}</div>
          <div className="ecc-kpi-l">MRR</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{formatCurrencyFromCents(Math.round(avg * 100))}</div>
          <div className="ecc-kpi-l">AVG RENT</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading || (isFetching && rows.length === 0)}
        error={error ? String(error) : undefined}
        rowHref={(r) => `/card/lease/${r.id}`}
        getRowId={(r) => r.id}
      />
    </section>
  );
}



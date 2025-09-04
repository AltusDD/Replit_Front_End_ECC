import React, { useMemo, useState } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { TENANT_COLUMNS, mapTenant } from "../columns";
import "../../../styles/table.css";

export default function TenantsPage() {
  const tenants = useCollection<any>("tenants");
  const leases = useCollection<any>("leases");
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const [contactableOnly, setContactableOnly] = useState<boolean>(false);

  const { rows, kpis, error, loading } = useMemo(() => {
    const uById = indexBy(units.data || [], "id");
    const pById = indexBy(props.data || [], "id");

    // For each tenant, pick latest related lease for property/unit context
    const latestByTenant: Record<string, any> = {};
    for (const l of leases.data || []) {
      const tids = [l.primary_tenant_id, l.tenant_id].filter(Boolean).map(String);
      for (const tid of tids) {
        const current = latestByTenant[tid];
        const stamp = new Date(l.updated_at || l.start_date || 0).getTime();
        const curStamp = current ? new Date(current.updated_at || current.start_date || 0).getTime() : -1;
        if (!current || stamp > curStamp) latestByTenant[tid] = l;
      }
    }

    const enriched = (tenants.data || []).map((t) => {
      const l = latestByTenant[String(t.id)];
      const unitLabel = l ? (uById.get(l.unit_id)?.unit_number || "—") : "—";
      const propName = l ? (pById.get(l.property_id)?.name || "—") : "—";
      return mapTenant(t, propName, unitLabel);
    });

    const filtered = enriched.filter((r) =>
      !contactableOnly || (r.email || r.phone)
    );

    const kpis = {
      tenants: enriched.length,
      contactable: enriched.filter((r) => r.email || r.phone).length,
      withBalance: enriched.filter((r) => (r.balance || 0) > 0).length,
      totalBalance: enriched.reduce((s, r) => s + (Number(r.balance || 0)), 0),
    };

    return {
      rows: filtered,
      kpis,
      loading: tenants.loading || leases.loading || units.loading || props.loading,
      error: tenants.error || leases.error || units.error || props.error,
    };
  }, [tenants, leases, units, props, contactableOnly]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const leaseTenants = rows.filter((r) => String(r.status).toLowerCase().includes("lease")).length;
    const prospects = rows.filter((r) => String(r.status).toLowerCase().includes("prospect")).length;
    const balance = rows.reduce((s, r) => s + (r.balance ?? 0), 0);
    return { total, leaseTenants, prospects, balance };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">TENANTS</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">LEASE TENANTS</div><div className="ecc-kpi-n">{kpi.leaseTenants.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">PROSPECTS</div><div className="ecc-kpi-n">{kpi.prospects.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">BALANCE</div><div className="ecc-kpi-n">${kpi.balance.toFixed(2)}</div></div>
      </div>

      {error && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{error}</div>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={TENANT_COLUMNS}
        loading={loading}
        csvName="tenants"
        onRowClick={(row) => console.log("open tenant", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Message", row)}>Message</button>
            <button onClick={() => console.log("Ledger", row)}>Open ledger</button>
          </>
        )}
      />
    </div>
  );
}

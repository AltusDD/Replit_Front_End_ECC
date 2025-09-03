import React, { useMemo, useState } from "react";
import { DataTable } from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { TENANT_COLUMNS, mapTenant } from "../columns";

export default function TenantsPage() {
  const tenants = useCollection<any>("tenants");
  const leases = useCollection<any>("leases");
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const [contactableOnly, setContactableOnly] = useState<boolean>(false);

  const { rows, kpis, error, loading } = useMemo(() => {
    const uById = indexBy(units.data, "id");
    const pById = indexBy(props.data, "id");

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

    const filtered = contactableOnly
      ? enriched.filter((r) => (r.email && r.email !== "—") || (r.phone && r.phone !== "—"))
      : enriched;

    const kpis = {
      tenants: enriched.length,
      contactable: enriched.filter((r) => (r.email && r.email !== "—") || (r.phone && r.phone !== "—")).length,
      leaseTenants: enriched.filter((r) => String(r.status).toLowerCase().includes("lease")).length,
      prospects: enriched.filter((r) => String(r.status).toLowerCase().includes("prospect")).length,
    };

    return {
      rows: filtered,
      kpis,
      loading: tenants.loading || leases.loading || units.loading || props.loading,
      error: tenants.error || leases.error || units.error || props.error,
    };
  }, [tenants, leases, units, props, contactableOnly]);

  return (
    <div className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.tenants}</div><div className="ecc-kpi-l">TENANTS</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.contactable}</div><div className="ecc-kpi-l">CONTACTABLE</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.leaseTenants}</div><div className="ecc-kpi-l">LEASE TENANTS</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.prospects}</div><div className="ecc-kpi-l">PROSPECTS</div></div>
      </div>

      <DataTable
        rows={rows}
        columns={TENANT_COLUMNS}
        loading={loading}
        error={error}
        toolbar={
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={contactableOnly} onChange={(e) => (e.target.checked ? setContactableOnly(true) : setContactableOnly(false))}/>
            Contactable only
          </label>
        }
      />
    </div>
  );
}

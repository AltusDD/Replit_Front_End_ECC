import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { TENANT_COLUMNS, mapTenant } from "../columns";
import "../../../styles/table.css";

export default function TenantsPage() {
  const tenants = useCollection<any>("/api/portfolio/tenants");
  const leases = useCollection<any>("/api/portfolio/leases");
  const units = useCollection<any>("/api/portfolio/units");
  const props = useCollection<any>("/api/portfolio/properties");

  const { rows, loading, error } = useMemo(() => {
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

    const mapped = (tenants.data || []).map((t) => {
      const l = latestByTenant[String(t.id)];
      const unit = l ? uById.get(l.unit_id) : null;
      const prop = l ? pById.get(l.property_id) : null;
      const unitLabel = unit?.unit_number || "—";
      const propName = prop?.name || prop?.address_line1 || "—";
      
      // Enrich tenant data before mapping
      const enriched = {
        ...t,
        property: { name: propName },
        unit: { label: unitLabel },
        leaseId: l?.id
      };
      
      return mapTenant(enriched);
    });

    return {
      rows: mapped,
      loading: tenants.loading || leases.loading || units.loading || props.loading,
      error: tenants.error || leases.error || units.error || props.error,
    };
  }, [tenants, leases, units, props]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const contactable = rows.filter((r) => r.email !== "—" || r.phone !== "—").length;
    const withBalance = rows.filter((r) => (r.balance || 0) > 0).length;
    const totalBalance = rows.reduce((s, r) => s + (Number(r.balance) || 0), 0);
    return { total, contactable, withBalance, totalBalance };
  }, [rows]);

  return (
    <section className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.total}</div>
          <div className="ecc-kpi-l">Total Tenants</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.contactable}</div>
          <div className="ecc-kpi-l">Contactable</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.withBalance}</div>
          <div className="ecc-kpi-l">With Balance</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">${kpis.totalBalance.toLocaleString()}</div>
          <div className="ecc-kpi-l">Total Balance</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={TENANT_COLUMNS}
        loading={loading}
        error={error}
        csvName="tenants"
        drawerTitle={(row) => row.tenant || `Tenant ${row.id}`}
        rowHref={(row) => `/card/tenant/${row.id}`}
      />
    </section>
  );
}

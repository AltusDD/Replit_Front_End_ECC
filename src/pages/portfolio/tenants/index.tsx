import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { TENANT_COLUMNS, mapTenant } from "../columns";
import { normalizeId } from "../../../utils/ids";
import "../../../styles/table.css";

export default function TenantsPage() {
  const tenants = useCollection<any>("/api/portfolio/tenants");
  const leases = useCollection<any>("/api/portfolio/leases");
  const properties = useCollection<any>("/api/portfolio/properties");
  const units = useCollection<any>("/api/portfolio/units");

  const { rows, loading, error } = useMemo(() => {
    // Build normalized maps with proper ID normalization
    const pById = new Map(properties.data?.map(p => [normalizeId(p.id), p]) || []);
    const uById = new Map(units.data?.map(u => [normalizeId(u.id), u]) || []);
    const leasesByTenant = new Map<string, any[]>();
    
    // Group leases by tenant
    for (const l of leases.data || []) {
      const tid = normalizeId(l.primary_tenant_id ?? l.tenant_id);
      if (!tid) continue;
      const list = leasesByTenant.get(tid) ?? [];
      list.push(l);
      leasesByTenant.set(tid, list);
    }

    const mapped = (tenants.data || []).map((t) => {
      const tid = normalizeId(t.id);
      const tenantLeases = leasesByTenant.get(tid) || [];
      
      // Pick latest lease by end_date (fallback start_date)
      const latestLease = tenantLeases.length > 0 
        ? tenantLeases.reduce((latest, current) => {
            const latestDate = latest.end_date || latest.start_date || '1970-01-01';
            const currentDate = current.end_date || current.start_date || '1970-01-01';
            return currentDate > latestDate ? current : latest;
          })
        : undefined;
      
      // Derive property and unit context
      const property = latestLease ? pById.get(normalizeId(latestLease.property_id)) : undefined;
      const unit = latestLease ? uById.get(normalizeId(latestLease.unit_id)) : undefined;
      const propertyName = property?.display_name ?? property?.name ?? property?.address_line1 ?? "—";
      const unitLabel = unit?.unit_number ?? unit?.label ?? unit?.name ?? "—";
      
      // Determine tenant type
      const tenantType = tenantLeases.length > 0 ? "LEASE_TENANT" : "PROSPECT_TENANT";
      
      // Shape row fields for columns.tsx
      const enriched = {
        ...t,
        property: { name: propertyName },
        unit: { label: unitLabel },
        type: tenantType,
      };
      
      return mapTenant(enriched);
    });

    return {
      rows: mapped,
      loading: tenants.loading || leases.loading || properties.loading || units.loading,
      error: tenants.error || leases.error || properties.error || units.error,
    };
  }, [tenants, leases, properties, units]);


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
          <div className="ecc-kpi-n">${kpis.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="ecc-kpi-l">Total Balance</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={TENANT_COLUMNS}
        loading={loading}
        error={error}
        csvName="tenants"
        drawerTitle={(row) => row.name || `Tenant ${row.id}`}
        rowHref={(row) => `/card/tenant/${row.id}`}
      />
    </section>
  );
}

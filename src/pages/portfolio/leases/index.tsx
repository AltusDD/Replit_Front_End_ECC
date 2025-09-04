import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { LEASE_COLUMNS, mapLease } from "../columns";
import "../../../styles/table.css";

export default function LeasesPage() {
  const leases = useCollection<any>("/api/portfolio/leases");
  const tenants = useCollection<any>("/api/portfolio/tenants");
  const props = useCollection<any>("/api/portfolio/properties");

  const { rows, loading, error } = useMemo(() => {
    const pById = indexBy(props.data || [], "id");
    const tById = indexBy(tenants.data || [], "id");

    const tenantsName = (l: any) => {
      const t =
        tById.get(l.primary_tenant_id) ||
        tById.get(l.tenant_id);
      return t?.display_name || t?.full_name || [t?.first_name, t?.last_name].filter(Boolean).join(" ");
    };

    const mapped = (leases.data || []).map((l) => {
      const prop = pById.get(l.property_id);
      const propName = prop?.name || prop?.address_line1 || "—";
      const tenant = tenantsName(l);
      
      // Enrich lease data before mapping
      const enriched = {
        ...l,
        "property.name": propName,
        tenants: [{ name: tenant }]
      };
      
      return mapLease(enriched);
    });

    return {
      rows: mapped,
      loading: leases.loading || tenants.loading || props.loading,
      error: leases.error || tenants.error || props.error,
    };
  }, [leases, tenants, props]);

  // TEMPORARY DEBUG
  if (leases.data && leases.data.length) {
    console.debug("AUDIT/leases RAW", leases.data[0]);
  }
  if (rows && rows.length) {
    console.debug("AUDIT/leases MAPPED", rows[0]);
  }

  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => String(r.status).toLowerCase() === "active").length;
    const ended = rows.filter((r) => String(r.status).toLowerCase() === "ended").length;
    const mrr = rows.reduce((s, r) => s + (Number(r.rent) || 0), 0);
    return { total, active, ended, mrr };
  }, [rows]);

  return (
    <section className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.total}</div>
          <div className="ecc-kpi-l">Total Leases</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.active}</div>
          <div className="ecc-kpi-l">Active</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.ended}</div>
          <div className="ecc-kpi-l">Ended</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">${kpis.mrr.toLocaleString()}</div>
          <div className="ecc-kpi-l">Monthly Revenue</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={LEASE_COLUMNS}
        loading={loading}
        error={error}
        csvName="leases"
        drawerTitle={(row) => `${row.property} - ${row.tenants}`}
        rowHref={(row) => `/card/lease/${row.id}`}
      />
    </section>
  );
}

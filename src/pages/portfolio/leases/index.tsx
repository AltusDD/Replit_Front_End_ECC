import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { LEASE_COLUMNS, mapLease } from "../columns";
import "../../../styles/table.css";

export default function LeasesPage() {
  const leases = useCollection<any>("leases");
  const tenants = useCollection<any>("tenants");
  const props = useCollection<any>("properties");

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
      const propName = pById.get(l.property_id)?.name || "—";
      return mapLease(l, propName, tenantsName(l));
    });

    return {
      rows: mapped,
      loading: leases.loading || tenants.loading || props.loading,
      error: leases.error || tenants.error || props.error,
    };
  }, [leases, tenants, props]);

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
        drawerTitle={(row) => `${row.property_name} - ${row.tenant_name}`}
      />
    </section>
  );
}

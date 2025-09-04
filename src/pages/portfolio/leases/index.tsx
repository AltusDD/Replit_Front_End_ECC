import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { LEASE_COLUMNS } from "../columns";
import "../../../styles/table.css";

export default function LeasesPage() {
  const leases = useCollection<any>("/api/portfolio/leases");

  const { rows, loading, error } = useMemo(() => {
    // Backend now provides all structured data
    return {
      rows: leases.data || [],
      loading: leases.loading,
      error: leases.error,
    };
  }, [leases]);


  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => String(r.status).toLowerCase() === "active").length;
    const ended = rows.filter((r) => String(r.status).toLowerCase() === "ended").length;
    const monthlyRevenue = (leases.data ?? [])
      .filter(l => String(l?.status ?? "").toLowerCase() === "active")
      .reduce((sum, l) => {
        const cents = Number(l?.rent_cents ?? l?.rent ?? 0);
        return sum + (Number.isFinite(cents) ? cents : 0);
      }, 0) / 100;
    return { total, active, ended, mrr: monthlyRevenue };
  }, [rows, leases]);

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

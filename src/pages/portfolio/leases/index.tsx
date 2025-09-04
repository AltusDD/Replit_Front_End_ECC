import React, { useMemo, useState } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { LEASE_COLUMNS, mapLease } from "../columns";
import "../../../styles/table.css";

export default function LeasesPage() {
  const leases = useCollection<any>("leases");
  const tenants = useCollection<any>("tenants");
  const props = useCollection<any>("properties");

  const [status, setStatus] = useState<string>("ALL");

  const { rows, kpis, error, loading } = useMemo(() => {
    const pById = indexBy(props.data || [], "id");
    const tById = indexBy(tenants.data || [], "id");

    const tenantsName = (l: any) => {
      const t =
        tById.get(l.primary_tenant_id) ||
        tById.get(l.tenant_id);
      return t?.display_name || t?.full_name || [t?.first_name, t?.last_name].filter(Boolean).join(" ");
    };

    const enriched = (leases.data || []).map((l) => {
      const propName = pById.get(l.property_id)?.name || "—";
      return mapLease(l, propName, tenantsName(l));
    });

    const filtered = enriched.filter((r) => status === "ALL" || String(r.status).toLowerCase() === status.toLowerCase());

    const kpis = {
      leases: enriched.length,
      active: enriched.filter((r) => String(r.status).toLowerCase() === "active").length,
      ended: enriched.filter((r) => String(r.status).toLowerCase() === "ended").length,
      mrr: enriched.reduce((s, r) => s + (Number(r.rent || 0)), 0),
      avg: (() => {
        const nums = enriched.map((r) => Number(r.rent || 0)).filter((n) => n > 0);
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
      })(),
    };

    return {
      rows: filtered,
      kpis,
      loading: leases.loading || tenants.loading || props.loading,
      error: leases.error || tenants.error || props.error,
    };
  }, [leases, tenants, props, status]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => String(r.status).toLowerCase() === "active").length;
    const ended = rows.filter((r) => String(r.status).toLowerCase() === "ended").length;
    const mrr = rows.reduce((s, r) => s + (r.rent ?? 0), 0);
    const avgRent = mrr / (rows.length || 1);
    return { total, active, ended, mrr, avgRent };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">LEASES</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ACTIVE</div><div className="ecc-kpi-n">{kpi.active.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ENDED</div><div className="ecc-kpi-n">{kpi.ended.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">AVG RENT</div><div className="ecc-kpi-n">${kpi.avgRent.toFixed(2)}</div></div>
      </div>

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<LeaseRow>
        rows={rows}
        columns={LEASE_COLUMNS}
        loading={loading}
        csvName="leases"
        onRowClick={(row) => console.log("open lease", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Collect rent", row)}>Collect rent</button>
            <button onClick={() => console.log("Send notice", row)}>Send notice</button>
          </>
        )}
      />
    </div>
  );
}

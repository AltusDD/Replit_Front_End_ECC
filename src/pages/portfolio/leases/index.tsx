import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { LEASE_COLUMNS, mapLease } from "../columns";
import { normalizeId } from "../../../utils/ids";
import "../../../styles/table.css";

export default function LeasesPage() {
  const leases = useCollection<any>("/api/portfolio/leases");
  const tenants = useCollection<any>("/api/portfolio/tenants");
  const props = useCollection<any>("/api/portfolio/properties");
  const units = useCollection<any>("/api/portfolio/units");

  const { rows, loading, error } = useMemo(() => {
    const pById = indexBy(props.data || [], "id");
    const tById = indexBy(tenants.data || [], "id");
    const uById = indexBy(units.data || [], "id");

    const mapped = (leases.data || []).map((l) => {
      const leaseId = normalizeId(l.id);
      const prop = pById.get(normalizeId(l.property_id));
      const unit = uById.get(normalizeId(l.unit_id));

      const propName = prop?.name ?? prop?.displayName ?? prop?.address_line1 ?? "—";
      const unitLabel = unit?.label ?? unit?.unit_number ?? unit?.number ?? unit?.name ?? "—";

      // Build tenants array (primary + secondary)
      const names: string[] = [];
      if (l.primary_tenant_id) {
        const pt = tById.get(normalizeId(l.primary_tenant_id));
        if (pt?.display_name || pt?.full_name || pt?.name) {
          names.push(pt.display_name ?? pt.full_name ?? pt.name);
        }
      }
      if (l.tenant_id && l.tenant_id !== l.primary_tenant_id) {
        const st = tById.get(normalizeId(l.tenant_id));
        if (st?.display_name || st?.full_name || st?.name) {
          names.push(st.display_name ?? st.full_name ?? st.name);
        }
      }

      const shaped = {
        ...l,
        property: { name: propName },
        unit: { label: unitLabel },
        tenants: names.length ? names : ["—"],
      };
      
      return mapLease(shaped);
    });

    return {
      rows: mapped,
      loading: leases.loading || tenants.loading || props.loading || units.loading,
      error: leases.error || tenants.error || props.error || units.error,
    };
  }, [leases, tenants, props, units]);


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

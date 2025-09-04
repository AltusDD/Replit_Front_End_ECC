import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { groupBy } from "../../../utils/dict";
import { OWNER_COLUMNS, mapOwner } from "../columns";
import "../../../styles/table.css";

export default function OwnersPage() {
  const owners = useCollection<any>("/api/portfolio/owners");
  const properties = useCollection<any>("/api/portfolio/properties");

  const { rows, loading, error } = useMemo(() => {
    // If you later add a property_owners link table, replace this logic.
    // For now, count properties by a simple owner_id if present, else 0.
    const byOwnerProps = groupBy(properties.data || [], (p) => p.owner_id ?? "__none__");

    const mapped = (owners.data || []).map((o) => {
      const count = (byOwnerProps.get(o.id)?.length || 0);
      return mapOwner(o, count);
    });

    return {
      rows: mapped,
      loading: owners.loading || properties.loading,
      error: owners.error || properties.error,
    };
  }, [owners, properties]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((o) => o.active).length;
    const totalProps = rows.reduce((s, o) => s + (o.property_count || 0), 0);
    return { total, active, totalProps };
  }, [rows]);

  return (
    <section className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.total}</div>
          <div className="ecc-kpi-l">Total Owners</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.active}</div>
          <div className="ecc-kpi-l">Active</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">{kpis.totalProps}</div>
          <div className="ecc-kpi-l">Total Properties</div>
        </div>
        <div className="ecc-kpi">
          <div className="ecc-kpi-n">—</div>
          <div className="ecc-kpi-l">—</div>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={OWNER_COLUMNS}
        loading={loading}
        error={error}
        csvName="owners"
        drawerTitle={(row) => row.name || `Owner ${row.id}`}
      />
    </section>
  );
}

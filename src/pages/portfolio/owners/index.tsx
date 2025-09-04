import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import useCollection from "../../../features/data/useCollection";
import { OWNER_COLUMNS, mapOwner } from "../columns";
import "../../../styles/table.css";

export default function OwnersPage() {
  const owners = useCollection<any>("/api/portfolio/owners");
  const properties = useCollection<any>("/api/portfolio/properties");

  const { rows, loading, error } = useMemo(() => {
    // Backend already provides structured data
    // Use it directly with minimal mapping
    const mapped = (owners.data || []).map(mapOwner);

    return {
      rows: mapped,
      loading: owners.loading,
      error: owners.error,
    };
  }, [owners]);


  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((o) => o.active).length;
    // Count properties by owner_id if available, else use total
    const totalProps = properties.data?.length || 0;
    return { total, active, totalProps };
  }, [rows, properties.data]);

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
        drawerTitle={(row) => row.company || `Owner ${row.id}`}
        rowHref={(row) => `/card/owner/${row.id}`}
      />
    </section>
  );
}

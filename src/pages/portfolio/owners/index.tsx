import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy, groupBy } from "../../../utils/dict";
import { OWNER_COLUMNS, mapOwner } from "../columns";
import "../../../styles/table.css";

export default function OwnersPage() {
  const owners = useCollection<any>("owners");
  const properties = useCollection<any>("properties");

  const { rows, kpis, error, loading } = useMemo(() => {
    // If you later add a property_owners link table, replace this logic.
    // For now, count properties by a simple owner_id if present, else 0.
    const byOwnerProps = groupBy(properties.data || [], (p) => p.owner_id ?? "__none__");

    const enriched = (owners.data || []).map((o) => {
      const count = (byOwnerProps.get(o.id)?.length || 0);
      return mapOwner(o, count);
    });

    const kpis = {
      owners: enriched.length,
      active: enriched.filter((o) => o.active).length,
      totalProps: Array.from(byOwnerProps.values()).reduce((s: number, list: any) => s + (Array.isArray(list) ? list.length : 0), 0),
    };

    return {
      rows: enriched,
      kpis,
      loading: owners.loading || properties.loading,
      error: owners.error || properties.error,
    };
  }, [owners, properties]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.active).length;
    const props = rows.reduce((s, r) => s + (r.property_count ?? 0), 0);
    return { total, active, props };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">OWNERS</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">ACTIVE</div><div className="ecc-kpi-n">{kpi.active.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">TOTAL PROPERTIES</div><div className="ecc-kpi-n">{kpi.props.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">—</div><div className="ecc-kpi-n">—</div></div>
      </div>

      {error && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{error}</div>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={OWNER_COLUMNS}
        loading={loading}
        csvName="owners"
        onRowClick={(row) => console.log("open owner", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Email owner", row)}>Email</button>
            <button onClick={() => console.log("View properties", row)}>View properties</button>
          </>
        )}
      />
    </div>
  );
}

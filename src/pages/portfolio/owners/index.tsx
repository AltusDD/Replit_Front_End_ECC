import React, { useMemo } from "react";
import { DataTable } from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy, groupBy } from "../../../utils/dict";
import { OWNER_COLUMNS, mapOwner } from "../columns";

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

  return (
    <div className="ecc-page">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.owners}</div><div className="ecc-kpi-l">OWNERS</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.active}</div><div className="ecc-kpi-l">ACTIVE</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-n">{kpis.totalProps}</div><div className="ecc-kpi-l">TOTAL PROPERTIES</div></div>
      </div>

      <DataTable
        rows={rows}
        columns={OWNER_COLUMNS}
        loading={loading}
        error={error}
      />
    </div>
  );
}

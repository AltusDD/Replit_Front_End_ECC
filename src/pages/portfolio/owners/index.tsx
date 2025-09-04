import React, { useMemo } from "react";
import DataTable from "../../../components/DataTable";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy, groupBy } from "../../../utils/dict";
import { OWNER_COLUMNS, mapOwner } from "../columns";
import "../../../styles/table.css";

async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j = await r.json();
  return Array.isArray(j) ? j : j.data ?? [];
}

export default function PortfolioOwnersPage() {
  const [raw, setRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setRaw(await fetchJSON(ENDPOINT));
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "Failed to load");
        setRaw([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows: OwnerRow[] = useMemo(() => raw.map(mapOwner), [raw]);

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

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<OwnerRow>
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

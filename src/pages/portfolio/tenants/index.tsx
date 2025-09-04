import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "/src/components/DataTable";
import { TENANT_COLUMNS, mapTenant, TenantRow } from "../columns";

const ENDPOINT = "/api/portfolio/tenants";

async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j = await r.json();
  return Array.isArray(j) ? j : j.data ?? [];
}

export default function PortfolioTenantsPage() {
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

  const rows: TenantRow[] = useMemo(() => raw.map(mapTenant), [raw]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const leaseTenants = rows.filter((r) => String(r.status).toLowerCase().includes("lease")).length;
    const prospects = rows.filter((r) => String(r.status).toLowerCase().includes("prospect")).length;
    const balance = rows.reduce((s, r) => s + (r.balance ?? 0), 0);
    return { total, leaseTenants, prospects, balance };
  }, [rows]);

  return (
    <div className="ecc-table-wrap">
      <div className="ecc-kpis">
        <div className="ecc-kpi"><div className="ecc-kpi-l">TENANTS</div><div className="ecc-kpi-n">{kpi.total.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">LEASE TENANTS</div><div className="ecc-kpi-n">{kpi.leaseTenants.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">PROSPECTS</div><div className="ecc-kpi-n">{kpi.prospects.toLocaleString()}</div></div>
        <div className="ecc-kpi"><div className="ecc-kpi-l">BALANCE</div><div className="ecc-kpi-n">${kpi.balance.toFixed(2)}</div></div>
      </div>

      {err && (
        <div className="ecc-kpi" style={{ marginBottom: 12 }}>
          <div className="ecc-kpi-l">Error</div>
          <div className="ecc-kpi-n">{err}</div>
        </div>
      )}

      <DataTable<TenantRow>
        rows={rows}
        columns={TENANT_COLUMNS}
        loading={loading}
        csvName="tenants"
        onRowClick={(row) => console.log("open tenant", row)}
        actions={(row) => (
          <>
            <button onClick={() => console.log("Message", row)}>Message</button>
            <button onClick={() => console.log("Ledger", row)}>Open ledger</button>
          </>
        )}
      />
    </div>
  );
}

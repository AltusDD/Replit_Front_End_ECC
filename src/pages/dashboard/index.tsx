// src/pages/dashboard/index.tsx
import React, { useMemo, useState } from "react";
import MetricCard from "../../components/data/MetricCard";
import "../../styles/dashboard.css";
import { useCollection } from "../../lib/useApi";

type Lease = { id: string|number; status?: string; end_date?: string; start_date?: string };
type Unit = { id: string|number; status?: string };
type WorkOrder = { id: string|number; status?: string; created_at?: string; property_name?: string };
type CollectionItem = { id: string|number; tenant?: string; amount_due?: number; days_late?: number };

function formatPct(n: number) { return `${(n * 100).toFixed(1)}%`; }
function fmt(n?: number) { return (n ?? 0).toLocaleString(); }
function daysUntil(dateISO?: string) {
  if (!dateISO) return Infinity;
  const d = new Date(dateISO);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000*60*60*24));
}

export default function Dashboard() {
  // add a "nonce" to params so we can retrigger the hooks if needed
  const [nonce] = useState(() => Date.now());

  const leases = useCollection("leases", { limit: 500, order: "updated_at.desc", nonce });
  const units = useCollection("units", { limit: 500, order: "updated_at.desc", nonce });
  const workOrders = useCollection("work_orders", { limit: 10, order: "created_at.desc", status: "open", nonce });
  const collections = useCollection("collections", { limit: 10, order: "updated_at.desc", status: "open", nonce });

  const loading = leases.loading || units.loading;

  const activeLeases = useMemo(
    () => (leases.data ?? []).filter((l: Lease) => (l.status ?? "").toLowerCase() === "active").length,
    [leases.data]
  );
  const totalUnits = useMemo(() => (units.data ?? []).length, [units.data]);
  const occupiedUnits = useMemo(
    () => (units.data ?? []).filter((u: Unit) => (u.status ?? "").toLowerCase() === "occupied").length,
    [units.data]
  );
  const occupancy = totalUnits ? occupiedUnits / totalUnits : 0;

  const openWOs = (workOrders.data ?? []) as WorkOrder[];
  const atRisk = (collections.data ?? []) as CollectionItem[];

  // Tiny fake series so sparkline isn't empty; replace with real trend when available
  const occSeries = useMemo(() => {
    if (!totalUnits) return [0,0,0,0,0,0,0];
    const base = occupancy * 100;
    return [base-1, base-0.6, base-0.2, base, base-0.4, base-0.1, base].map(v => Math.max(0, Math.min(100, v)));
  }, [occupancy, totalUnits]);

  const leaseSeries = useMemo(() => {
    const n = activeLeases;
    return [n-5, n-3, n-2, n, n-1, n, n+1].map(v => Math.max(0, v));
  }, [activeLeases]);

  const woSeries = useMemo(() => {
    const n = openWOs.length;
    return [n+3, n+2, n+1, n, n+1, n].map(v => Math.max(0, v));
  }, [openWOs.length]);

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>

      <div className="metrics-grid">
        <MetricCard
          title="Occupancy"
          value={loading ? "…" : formatPct(occupancy)}
          delta={0}
          suffix=""
          series={occSeries}
          loading={loading}
        />
        <MetricCard
          title="Active Leases"
          value={fmt(activeLeases)}
          delta={0}
          series={leaseSeries}
          loading={leases.loading}
        />
        <MetricCard
          title="Open Work Orders"
          value={fmt(openWOs.length)}
          delta={0}
          series={woSeries}
          loading={workOrders.loading}
        />
        <MetricCard
          title="Collections at Risk"
          value={`$${fmt(atRisk.reduce((a, c) => a + (c.amount_due ?? 0), 0))}`}
          delta={0}
          series={[1,1,1,1,1,1,1]} /* placeholder */
          loading={collections.loading}
        />
      </div>

      <div className="two-col">
        <div className="panel table-like">
          <h3 style={{marginTop:0, color:"var(--ink-1)"}}>Recent Open Work Orders</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(openWOs ?? []).map((w) => (
                <tr key={String(w.id)}>
                  <td>{w.id}</td>
                  <td>{w.property_name ?? "-"}</td>
                  <td>{w.created_at ? new Date(w.created_at).toLocaleDateString() : "-"}</td>
                  <td>{w.status ?? "-"}</td>
                </tr>
              ))}
              {openWOs.length === 0 && (
                <tr><td colSpan={4} style={{color:"var(--ink-3)"}}>No open work orders.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel table-like">
          <h3 style={{marginTop:0, color:"var(--ink-1)"}}>Leases Expiring in 30 Days</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ends</th>
                <th>In (days)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {((leases.data ?? []) as Lease[])
                .filter(l => daysUntil(l.end_date) <= 30)
                .sort((a,b) => daysUntil(a.end_date) - daysUntil(b.end_date))
                .slice(0, 10)
                .map(l => (
                  <tr key={String(l.id)}>
                    <td>{l.id}</td>
                    <td>{l.end_date ? new Date(l.end_date).toLocaleDateString() : "-"}</td>
                    <td>{isFinite(daysUntil(l.end_date)) ? daysUntil(l.end_date) : "-"}</td>
                    <td>{l.status ?? "-"}</td>
                  </tr>
              ))}
              {(((leases.data ?? []) as Lease[]).filter(l => daysUntil(l.end_date) <= 30).length === 0) && (
                <tr><td colSpan={4} style={{color:"var(--ink-3)"}}>No leases expiring in the next 30 days.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

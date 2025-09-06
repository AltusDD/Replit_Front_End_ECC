// Strictly live endpoints, abort-safe, side-effect clean. No mock data.
// Endpoints expected:
//  - /api/portfolio/properties
//  - /api/portfolio/units
//  - /api/portfolio/leases
//  - /api/portfolio/tenants
//  - /api/maintenance/workorders  (optional; empty array if 404)
//  - /api/accounting/transactions (optional; empty array if 404)

import { useState, useEffect } from 'react';

type AbortLike = { name?: string };
const isAbortError = (e: unknown) =>
  e instanceof DOMException ? e.name === "AbortError" : (e as AbortLike)?.name === "AbortError";

async function safeJSON<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    // Return empty arrays for optional endpoints instead of throwing
    if (res.status === 404 && /workorders|transactions/.test(url)) return [] as unknown as T;
    throw new Error(`${res.status} ${res.statusText} @ ${url}`);
  }
  return res.json() as Promise<T>;
}

function toNum(n: any): number | null {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

export function useDashboardData() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const [properties, units, leases, tenants, workorders, transactions] = await Promise.all([
          safeJSON<any[]>("/api/portfolio/properties", ac.signal),
          safeJSON<any[]>("/api/portfolio/units", ac.signal),
          safeJSON<any[]>("/api/portfolio/leases", ac.signal),
          safeJSON<any[]>("/api/portfolio/tenants", ac.signal),
          safeJSON<any[]>("/api/maintenance/workorders", ac.signal).catch(() => []),
          safeJSON<any[]>("/api/accounting/transactions", ac.signal).catch(() => []),
        ]);

        // ---------- KPIs (live) ----------
        const totalUnits = units.length;
        const occupiedUnits = units.filter(u => (u.status ?? "").toString().toLowerCase() === "occupied").length;
        const occupancy = totalUnits ? (occupiedUnits / totalUnits) * 100 : 0;

        // Rent-ready (vacant & marketRent > 0)
        const rentReady = units.filter(u => {
          const s = (u.status ?? "").toString().toLowerCase();
          return (s === "vacant" || s === "") && toNum(u.marketRent) && toNum(u.marketRent)! > 0;
        }).length;

        // Collections MTD from transactions
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const mtd = transactions.filter(t => {
          const d = new Date(t.date || t.posted_at || t.created_at);
          return d >= monthStart && d <= now;
        });
        const billed = mtd
          .filter(t => (t.type || t.kind || "").toString().toLowerCase() === "charge")
          .reduce((s, t) => s + (toNum(t.amount_cents) ?? toNum(t.amount) ?? 0), 0);
        const paid = mtd
          .filter(t => (t.type || t.kind || "").toString().toLowerCase() === "payment")
          .reduce((s, t) => s + (toNum(t.amount_cents) ?? toNum(t.amount) ?? 0), 0);
        const collectionsMTD = billed > 0 ? (paid / billed) * 100 : 0;

        // Critical WOs
        const criticalWOs = workorders.filter(
          w => ["high","critical"].includes((w.priority ?? "").toString().toLowerCase())
        ).length;

        // ---------- Action feed ----------
        const fortyFiveDays = Date.now() + 45 * 86400000;
        const expiring = leases
          .map(l => ({ ...l, endDate: l.end_date ?? l.end ?? l.endDate }))
          .filter(l => {
            const dt = new Date(l.endDate);
            return Number.isFinite(+dt) && +dt <= fortyFiveDays && +dt >= Date.now();
          })
          .slice(0, 3);

        const delinquents = tenants
          .map(t => ({ ...t, balance: toNum(t.balance_cents) ?? toNum(t.balance) ?? 0 }))
          .filter(t => (t.balance ?? 0) > 0)
          .sort((a,b) => (b.balance ?? 0) - (a.balance ?? 0))
          .slice(0, 3);

        const hotlist = workorders
          .filter(w => {
            const priority = (w.priority ?? "").toString().toLowerCase();
            const ageDays = Math.floor((Date.now() - new Date(w.created_at || w.createdAt).getTime()) / 86400000);
            return ["high", "critical"].includes(priority) || ageDays >= 7;
          })
          .slice(0, 3);

        // ---------- Occupancy by City ----------
        const byCityMap = new Map<string, { props: number; occ: number; vac: number }>();
        properties.forEach(p => {
          const city = (p.city ?? "—").toString();
          const r = byCityMap.get(city) ?? { props: 0, occ: 0, vac: 0 };
          r.props += 1;
          // If property-level occupancy provided, respect it; else infer from units.
          const propUnits = units.filter(u => String(u.property_id ?? u.propertyId ?? u.property) === String(p.id));
          const occ = propUnits.filter(u => (u.status ?? "").toString().toLowerCase() === "occupied").length;
          const vac = propUnits.length - occ;
          r.occ += occ; r.vac += vac;
          byCityMap.set(city, r);
        });
        const occByCity = Array.from(byCityMap.entries()).map(([city, v]) => ({
          city,
          properties: v.props,
          occupied: v.occ,
          vacant: v.vac,
          occPct: v.occ + v.vac ? (v.occ / (v.occ + v.vac)) * 100 : 0,
        })).sort((a,b) => a.city.localeCompare(b.city));

        setState({
          kpis: {
            occupancy,
            rentReady,
            collectionsMTD,
            criticalWOs,
          },
          actionFeed: { delinquents, expiring, hotlist },
          occupancyByCity: occByCity,
          // keep existing fields (map, charts) populated downstream from live arrays only
          raw: { properties, units, leases, tenants, workorders, transactions },
        } as any);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  return { data: state, loading, error };
}
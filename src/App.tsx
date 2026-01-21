import React, { useEffect, useMemo, useState } from "react";
import { Route, Switch, useLocation, useRoute } from "wouter";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "./components/ui/ToastContainer";

import { jget } from "./lib/http";

/**
 * IMPORTANT:
 * These imports point at the V3 pages that already exist as folders with index.tsx.
 * Example tree:
 *   src/pages/portfolio/properties/index.tsx
 *   src/pages/portfolio/units/index.tsx
 *   src/pages/portfolio/leases/index.tsx
 *   src/pages/portfolio/tenants/index.tsx
 *   src/pages/portfolio/owners/index.tsx
 */
import PropertiesPage from "./pages/portfolio/properties";
import UnitsPage from "./pages/portfolio/units";
import LeasesPage from "./pages/portfolio/leases";
import TenantsPage from "./pages/portfolio/tenants";
import OwnersPage from "./pages/portfolio/owners";

// Working Asset Card Pages (NOT placeholder components)
import PropertyCardPage from "./pages/card/property";
import UnitCardPage from "./pages/card/unit"; 
import LeaseCardPage from "./pages/card/lease";
import TenantCardPage from "./pages/card/tenant";
import OwnerCardPage from "./pages/card/owner";

// Reports Pages
import ReportsCreatePage from "./pages/reports/Create";
import ReportsSavedPage from "./pages/reports/Saved";
import ReportsTemplatesPage from "./pages/reports/Templates";

// Admin Pages
import AdminSyncPage from "./features/admin/pages/AdminSyncPage";
import AdminGeocodeManagementPage from "./features/admin/pages/AdminGeocodeManagementPage";
import AdminTransferManagementPage from "./features/admin/pages/AdminTransferManagementPage";

// Systems Pages
import IntegrationsHealthPage from "./features/systems/integrations/IntegrationsHealthPage";

// Owner Transfer
import OwnerTransferPage from "./features/ownerTransfer/OwnerTransferPage";
import OwnerTransferDetailPage from "./features/owners/pages/OwnerTransferDetailPage";

// Property Detail
import PropertyDetailPage from "./pages/PropertyDetailPage";

// Dashboard Page
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// DataHub Page
import DataHub from "./pages/DataHub";


function HomeRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    // pick a known-good landing route that exists in this app
    setLocation("/portfolio/properties");
  }, [setLocation]);
  return null;
}

function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Route not found</h1>
      <p className="text-neutral-400 mb-6">
        The page you requested doesn't exist. Try a known route:
      </p>
      <div className="flex gap-3 justify-center">
        <a className="px-3 py-2 rounded-xl border border-neutral-700" href="/portfolio/properties">Properties</a>
        <a className="px-3 py-2 rounded-xl border border-neutral-700" href="/portfolio/units">Units</a>
        <a className="px-3 py-2 rounded-xl border border-neutral-700" href="/portfolio/leases">Leases</a>
      </div>
    </div>
  );
}

type Envelope<T = any> = {
  data: T[];
  meta?: {
    totalCount?: number;
  };
};

function asEnvelope<T = any>(x: any): Envelope<T> | null {
  if (!x || typeof x !== "object") return null;
  const data = (x as any).data;
  if (!Array.isArray(data)) return null;
  const meta = (x as any).meta;
  return { data, meta };
}

function pickFirstId(rows: any[], keys: string[]) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const row = rows[0];
  if (!row || typeof row !== "object") return null;
  for (const k of keys) {
    const v = (row as any)[k];
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function fmtCell(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.length} items]`;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function RecordsPanel(props: { title: string; rows: any[]; loading: boolean; error: string | null }) {
  const { title, rows, loading, error } = props;

  const cols = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return [] as string[];
    const keys = new Set<string>();
    for (const r of rows.slice(0, 10)) {
      if (r && typeof r === "object") {
        for (const k of Object.keys(r)) keys.add(k);
      }
    }
    return Array.from(keys).slice(0, 10);
  }, [rows]);

  return (
    <section className="rounded-2xl border border-neutral-800 p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {loading ? <span className="text-sm text-neutral-400">Loading…</span> : null}
      </div>
      {error ? <div className="text-sm text-red-400 mb-3">{error}</div> : null}
      {!loading && rows.length === 0 ? (
        <div className="text-sm text-neutral-400">No records</div>
      ) : cols.length === 0 ? null : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-800">
                {cols.map((c) => (
                  <th key={c} className="py-2 pr-4 font-medium">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((r, idx) => (
                <tr key={idx} className="border-b border-neutral-900">
                  {cols.map((c) => (
                    <td key={c} className="py-2 pr-4 align-top">{fmtCell((r as any)?.[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PropertyAssetPage() {
  const [, params] = useRoute("/asset/property/:id");
  const propertyId = useMemo(() => Number(params?.id), [params?.id]);

  const [propertyRows, setPropertyRows] = useState<any[]>([]);
  const [unitsRows, setUnitsRows] = useState<any[]>([]);
  const [leasesRows, setLeasesRows] = useState<any[]>([]);
  const [tenantsRows, setTenantsRows] = useState<any[]>([]);

  const [loadingProperty, setLoadingProperty] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingLeases, setLoadingLeases] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);

  const [errorProperty, setErrorProperty] = useState<string | null>(null);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);
  const [errorLeases, setErrorLeases] = useState<string | null>(null);
  const [errorTenants, setErrorTenants] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(propertyId) || propertyId <= 0) return;

    let cancelled = false;
    (async () => {
      setErrorProperty(null);
      setErrorUnits(null);
      setErrorLeases(null);
      setErrorTenants(null);
      setPropertyRows([]);
      setUnitsRows([]);
      setLeasesRows([]);
      setTenantsRows([]);

      setLoadingProperty(true);
      const propRaw = await jget(`/api/portfolio/properties_detail?property_id=${propertyId}`);
      const propEnv = asEnvelope(propRaw);
      if (!cancelled) {
        setLoadingProperty(false);
        if (!propEnv) {
          setErrorProperty("No response (non-200 or invalid envelope)");
        } else {
          setPropertyRows(propEnv.data ?? []);
        }
      }

      setLoadingUnits(true);
      const unitsRaw = await jget(
        `/api/portfolio/properties_units?property_id=${propertyId}&page=1&pageSize=25`
      );
      const unitsEnv = asEnvelope(unitsRaw);
      const units = unitsEnv?.data ?? [];
      const unitId = pickFirstId(units, ["unit_id", "id"]);
      if (!cancelled) {
        setLoadingUnits(false);
        if (!unitsEnv) {
          setErrorUnits("No response (non-200 or invalid envelope)");
        } else {
          setUnitsRows(units);
        }
      }
      if (!unitId) return;

      setLoadingLeases(true);
      const leasesRaw = await jget(`/api/portfolio/units_leases?unit_id=${unitId}&page=1&pageSize=25`);
      const leasesEnv = asEnvelope(leasesRaw);
      const leases = leasesEnv?.data ?? [];
      const leaseId = pickFirstId(leases, ["lease_id", "id"]);
      if (!cancelled) {
        setLoadingLeases(false);
        if (!leasesEnv) {
          setErrorLeases("No response (non-200 or invalid envelope)");
        } else {
          setLeasesRows(leases);
        }
      }
      if (!leaseId) return;

      setLoadingTenants(true);
      const tenantsRaw = await jget(`/api/portfolio/leases_tenants?lease_id=${leaseId}&page=1&pageSize=25`);
      const tenantsEnv = asEnvelope(tenantsRaw);
      if (!cancelled) {
        setLoadingTenants(false);
        if (!tenantsEnv) {
          setErrorTenants("No response (non-200 or invalid envelope)");
        } else {
          setTenantsRows(tenantsEnv.data ?? []);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (!Number.isFinite(propertyId) || propertyId <= 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold mb-2">Property Asset</h1>
        <div className="text-sm text-neutral-400">Invalid property id.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Property Drill Chain</h1>
        <div className="text-sm text-neutral-400">Property ID: {propertyId}</div>
      </div>

      <RecordsPanel title="1) Property Detail" rows={propertyRows} loading={loadingProperty} error={errorProperty} />
      <RecordsPanel title="2) Units (page=1,pageSize=25)" rows={unitsRows} loading={loadingUnits} error={errorUnits} />
      <RecordsPanel title="3) Leases for first unit (page=1,pageSize=25)" rows={leasesRows} loading={loadingLeases} error={errorLeases} />
      <RecordsPanel title="4) Tenants for first lease (page=1,pageSize=25)" rows={tenantsRows} loading={loadingTenants} error={errorTenants} />
    </div>
  );
}

export default function App() {

  return (
    <div id="ecc-app">
      <div className="ecc-shell">
        <Sidebar />

        {/* Main content area */}
        <main className="ecc-main" role="main" id="main">
        <Switch>
          {/* Home redirect */}
          <Route path="/"><HomeRedirect /></Route>
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/data" component={DataHub} />
          

          {/* -------- Portfolio V3 (ACTIVE) -------- */}
          <Route path="/portfolio/properties" component={PropertiesPage} />
          <Route path="/portfolio/properties/:id" component={PropertyDetailPage} />
          <Route path="/portfolio/units" component={UnitsPage} />
          <Route path="/portfolio/leases" component={LeasesPage} />
          <Route path="/portfolio/tenants" component={TenantsPage} />
          <Route path="/portfolio/owners" component={OwnersPage} />
          {/* -------------------------------------- */}

          {/* -------- Working Asset Card Pages -------- */}
          <Route path="/asset/property/:id" component={PropertyAssetPage} />
          <Route path="/card/property/:id" component={PropertyCardPage} />
          <Route path="/card/unit/:id" component={UnitCardPage} />
          <Route path="/card/lease/:id" component={LeaseCardPage} />
          <Route path="/card/tenant/:id" component={TenantCardPage} />
          <Route path="/card/owner/:id" component={OwnerCardPage} />
          {/* ------------------------------------------ */}

          {/* -------- Reports Pages -------- */}
          <Route path="/reports/create" component={ReportsCreatePage} />
          <Route path="/reports/saved" component={ReportsSavedPage} />
          <Route path="/reports/templates" component={ReportsTemplatesPage} />
          {/* ------------------------------- */}

          {/* -------- Admin Pages -------- */}
          <Route path="/admin/sync" component={AdminSyncPage} />
          <Route path="/admin/geocode" component={AdminGeocodeManagementPage} />
          <Route path="/admin/transfers" component={AdminTransferManagementPage} />

          {/* -------- Systems Pages -------- */}
          <Route path="/systems/integrations" component={IntegrationsHealthPage} />
          {/* ----------------------------- */}
          
          {/* -------- Owner Transfer -------- */}
          <Route path="/owners/transfer" component={OwnerTransferPage} />
          <Route path="/owners/transfer/detail" component={OwnerTransferDetailPage} />
          {/* -------------------------------- */}

          {/* Keep any other existing routes you have here.
             Do NOT route to the old mock pages (Properties.tsx, etc.). */}

          {/* 404 */}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
      <ToastContainer />
      </div>
    </div>
  );
}

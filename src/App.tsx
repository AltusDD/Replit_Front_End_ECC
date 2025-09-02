import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";

// Lazy page modules (each must have a default export in its index.tsx)
const Dashboard   = lazy(() => import("./pages/dashboard"));
const Properties  = lazy(() => import("./pages/portfolio/properties"));
const Units       = lazy(() => import("./pages/portfolio/units"));
const Leases      = lazy(() => import("./pages/portfolio/leases"));
const Tenants     = lazy(() => import("./pages/portfolio/tenants"));
const Owners      = lazy(() => import("./pages/portfolio/owners"));

export default function App() {
  return (
    <>
      <Sidebar />
      <main className="ecc-main">
        <Suspense fallback={<div className="panel">Loading…</div>}>
          <Switch>
            {/* Primary */}
            <Route path="/dashboard"><Dashboard /></Route>

            {/* Portfolio (real pages) */}
            <Route path="/portfolio/properties"><Properties /></Route>
            <Route path="/portfolio/units"><Units /></Route>
            <Route path="/portfolio/leases"><Leases /></Route>
            <Route path="/portfolio/tenants"><Tenants /></Route>
            <Route path="/portfolio/owners"><Owners /></Route>
            <Route path="/portfolio"><Redirect to="/portfolio/properties" /></Route>

            {/* Buckets (stubs for now) */}
            <Route path="/ops/:rest*"><h1 className="pageTitle">Operations</h1></Route>
            <Route path="/growth/:rest*"><h1 className="pageTitle">Growth</h1></Route>
            <Route path="/system/:rest*"><h1 className="pageTitle">System</h1></Route>
            <Route path="/data/:rest*"><h1 className="pageTitle">Data Management</h1></Route>
            <Route path="/investor/:rest*"><h1 className="pageTitle">Investor Portal</h1></Route>
            <Route path="/integrations/:rest*"><h1 className="pageTitle">Integrations</h1></Route>

            {/* Root + 404 */}
            <Route path="/"><Redirect to="/dashboard" /></Route>
            <Route><h1 className="pageTitle">Not Found</h1></Route>
          </Switch>
        </Suspense>
      </main>
    </>
  );
}

import React from "react";
import { Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";

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

// Card Pages
import PropertyCardPage from "./pages/card/property";
import UnitCardPage from "./pages/card/unit";
import LeaseCardPage from "./pages/card/lease";
import TenantCardPage from "./pages/card/tenant";
import OwnerCardPage from "./pages/card/owner";

// Reports Pages
import ReportsCreatePage from "./pages/reports/Create";
import ReportsSavedPage from "./pages/reports/Saved";
import ReportsTemplatesPage from "./pages/reports/Templates";

/**
 * If you already have a real Dashboard page component, swap this import in:
 *   import DashboardPage from "./pages/dashboard";
 * …and remove the inline fallback below.
 */
function DashboardFallback() {
  return (
    <section className="ecc-page">
      <h1 className="ecc-page-title">Dashboard</h1>
    </section>
  );
}

export default function App() {
  return (
    <div className="ecc-shell">
      <Sidebar />

      {/* Main content area */}
      <main className="ecc-main" role="main" id="main">
        <Switch>
          {/* Home -> Dashboard */}
          <Route path="/" component={() => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" component={DashboardFallback} />

          {/* -------- Portfolio V3 (ACTIVE) -------- */}
          <Route path="/portfolio/properties" component={PropertiesPage} />
          <Route path="/portfolio/units" component={UnitsPage} />
          <Route path="/portfolio/leases" component={LeasesPage} />
          <Route path="/portfolio/tenants" component={TenantsPage} />
          <Route path="/portfolio/owners" component={OwnersPage} />
          {/* -------------------------------------- */}

          {/* -------- Card Pages -------- */}
          <Route path="/card/property/:id" component={PropertyCardPage} />
          <Route path="/card/unit/:id" component={UnitCardPage} />
          <Route path="/card/lease/:id" component={LeaseCardPage} />
          <Route path="/card/tenant/:id" component={TenantCardPage} />
          <Route path="/card/owner/:id" component={OwnerCardPage} />
          {/* ---------------------------- */}

          {/* -------- Reports Pages -------- */}
          <Route path="/reports/create" component={ReportsCreatePage} />
          <Route path="/reports/saved" component={ReportsSavedPage} />
          <Route path="/reports/templates" component={ReportsTemplatesPage} />
          {/* ------------------------------- */}

          {/* Keep any other existing routes you have here.
             Do NOT route to the old mock pages (Properties.tsx, etc.). */}

          {/* 404 */}
          <Route>
            <section className="ecc-page">
              <h1 className="ecc-page-title">Not Found</h1>
              <p>That page doesn’t exist.</p>
            </section>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

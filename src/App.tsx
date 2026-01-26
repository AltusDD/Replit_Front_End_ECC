import React from "react";
// 1. Import `Router` from wouter along with the others
import { Router, Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/layout/Sidebar";

// Portfolio page imports - using simple page shells  
import PropertiesPage from "./pages/portfolio/PropertiesPage";
import PropertyDetailPage from "./pages/portfolio/PropertyDetailPage";
import UnitsPage from "./pages/portfolio/UnitsPage";
import LeasesPage from "./pages/portfolio/LeasesPage";
import TenantsPage from "./pages/portfolio/TenantsPage";
import OwnersPage from "./pages/portfolio/OwnersPage";

// Assets page import
import AssetsPage from "./pages/assets/AssetsPage";

import "./styles/theme.css";
import "./styles/app.css";

export default function App() {
  return (
    // 2. Wrap your entire application layout in <Router>
    <Router>
      <div className="ecc-shell">
        <Sidebar />
        <main className="ecc-main">
          <Switch>
            {/* Primary */}
            <Route path="/dashboard"><h1 className="ecc-page-title">Dashboard</h1></Route>

            {/* Portfolio - using existing functional pages */}
            <Route path="/portfolio/properties/:id"><PropertyDetailPage /></Route>
            <Route path="/portfolio/properties"><PropertiesPage /></Route>
            <Route path="/portfolio/units"><UnitsPage /></Route>
            <Route path="/portfolio/leases"><LeasesPage /></Route>
            <Route path="/portfolio/tenants"><TenantsPage /></Route>
            <Route path="/portfolio/owners"><OwnersPage /></Route>

            {/* Assets page */}
            <Route path="/assets"><AssetsPage /></Route>

            {/* Operations (selected) */}
            <Route path="/ops/reports"><h1 className="ecc-page-title">Reports</h1></Route>
            <Route path="/ops/reports/create"><h1 className="ecc-page-title">Create Report</h1></Route>
            <Route path="/ops/reports/saved"><h1 className="ecc-page-title">Saved Reports</h1></Route>

            {/* … keep your other existing routes … */}

            {/* Redirect & Fallback */}
            <Route path="/"><Redirect to="/dashboard" /></Route>
            <Route><h1 className="ecc-page-title">Not Found</h1></Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
import React from "react";
// 1. Import `Router` from wouter along with the others
import { Router, Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";

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

            {/* Portfolio */}
            <Route path="/portfolio/properties"><h1 className="ecc-page-title">Properties</h1></Route>
            <Route path="/portfolio/units"><h1 className="ecc-page-title">Units</h1></Route>
            <Route path="/portfolio/leases"><h1 className="ecc-page-title">Leases</h1></Route>
            <Route path="/portfolio/tenants"><h1 className="ecc-page-title">Tenants</h1></Route>
            <Route path="/portfolio/owners"><h1 className="ecc-page-title">Owners</h1></Route>

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
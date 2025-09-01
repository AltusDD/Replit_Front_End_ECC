// src/App.tsx
import React from "react";
import { Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";
import "./styles/theme.css";
import "./styles/app.css";

export default function App() {
  return (
    <>
      <Sidebar />
      <main className="ecc-main">
        <Switch>
          <Route path="/dashboard"><h1>Dashboard</h1></Route>

          {/* Portfolio */}
          <Route path="/portfolio/properties"><h1>Properties</h1></Route>
          <Route path="/portfolio/units"><h1>Units</h1></Route>
          <Route path="/portfolio/leases"><h1>Leases</h1></Route>
          <Route path="/portfolio/tenants"><h1>Tenants</h1></Route>
          <Route path="/portfolio/owners"><h1>Owners</h1></Route>

          {/* Accounting, AI, Legal, Maintenance, etc. */}
          <Route path="/ops/:rest*"><h1>Operations</h1></Route>

          {/* Growth */}
          <Route path="/growth/:rest*"><h1>Growth</h1></Route>

          {/* System / Data / Investor / Integrations */}
          <Route path="/system/:rest*"><h1>System</h1></Route>
          <Route path="/data/:rest*"><h1>Data Management</h1></Route>
          <Route path="/investor/:rest*"><h1>Investor Portal</h1></Route>
          <Route path="/integrations/:rest*"><h1>Integrations</h1></Route>

          {/* Redirect / → /dashboard so “Not Found” disappears */}
          <Route path="/"><Redirect to="/dashboard" /></Route>
          <Route><h1>Not Found</h1></Route>
        </Switch>
      </main>
    </>
  );
}

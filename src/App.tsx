// src/App.tsx
import React from "react";
import { Route, Switch } from "wouter";
import Sidebar from "./components/Sidebar";
import "./styles/theme.css";
import "./styles/app.css";

export default function App() {
  return (
    <div className="ecc-app">
      <Sidebar />
      <main className="ecc-main">
        <Switch>
          <Route path="/dashboard"><h1 className="pageTitle">Dashboard</h1></Route>

          {/* Portfolio */}
          <Route path="/portfolio/properties"><h1 className="pageTitle">Properties</h1></Route>
          <Route path="/portfolio/units"><h1 className="pageTitle">Units</h1></Route>
          <Route path="/portfolio/leases"><h1 className="pageTitle">Leases</h1></Route>
          <Route path="/portfolio/tenants"><h1 className="pageTitle">Tenants</h1></Route>
          <Route path="/portfolio/owners"><h1 className="pageTitle">Owners</h1></Route>

          {/* catch-all */}
          <Route><h1 className="pageTitle">Not Found</h1></Route>
        </Switch>
      </main>
    </div>
  );
}

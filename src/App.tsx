import React from "react";
import { Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";
import "./styles/theme.css";
import "./styles/app.css";

export default function App() {
  return (
    <div className="ecc-shell">
      <Sidebar />
      <main className="ecc-main">
        <Switch>
          <Route path="/dashboard"><h1>Dashboard</h1></Route>

          {/* sample routes so Not Found goes away */}
          <Route path="/portfolio/properties"><h1>Properties</h1></Route>
          <Route path="/portfolio/units"><h1>Units</h1></Route>
          <Route path="/portfolio/leases"><h1>Leases</h1></Route>
          <Route path="/portfolio/tenants"><h1>Tenants</h1></Route>
          <Route path="/portfolio/owners"><h1>Owners</h1></Route>

          <Route path="/"><Redirect to="/dashboard" /></Route>
          <Route><h1>Not Found</h1></Route>
        </Switch>
      </main>
    </div>
  );
}

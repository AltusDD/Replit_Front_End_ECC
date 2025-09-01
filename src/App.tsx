import React from "react";
import { Route, Switch, Redirect } from "wouter";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <>
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

          {/* Ops buckets */}
          <Route path="/ops/:rest*"><h1 className="pageTitle">Operations</h1></Route>
          <Route path="/growth/:rest*"><h1 className="pageTitle">Growth</h1></Route>
          <Route path="/system/:rest*"><h1 className="pageTitle">System</h1></Route>
          <Route path="/data/:rest*"><h1 className="pageTitle">Data Management</h1></Route>
          <Route path="/investor/:rest*"><h1 className="pageTitle">Investor Portal</h1></Route>
          <Route path="/integrations/:rest*"><h1 className="pageTitle">Integrations</h1></Route>

          <Route path="/"><Redirect to="/dashboard" /></Route>
          <Route><h1 className="pageTitle">Not Found</h1></Route>
        </Switch>
      </main>
    </>
  );
}

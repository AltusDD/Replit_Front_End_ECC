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
          {/* Primary */}
          <Route path="/dashboard">
            <h1 className="ecc-page-title">Dashboard</h1>
          </Route>

          {/* Managed Assets */}
          <Route path="/portfolio/properties"><h1 className="ecc-page-title">Properties</h1></Route>
          <Route path="/portfolio/units"><h1 className="ecc-page-title">Units</h1></Route>
          <Route path="/portfolio/leases"><h1 className="ecc-page-title">Leases</h1></Route>
          <Route path="/portfolio/tenants"><h1 className="ecc-page-title">Tenants</h1></Route>
          <Route path="/portfolio/owners"><h1 className="ecc-page-title">Owners</h1></Route>

          {/* Cards (Entity Hubs) */}
          <Route path="/card/property/:id"><h1 className="ecc-page-title">Property Card</h1></Route>
          <Route path="/card/unit/:id"><h1 className="ecc-page-title">Unit Card</h1></Route>
          <Route path="/card/lease/:id"><h1 className="ecc-page-title">Lease Card</h1></Route>
          <Route path="/card/tenant/:id"><h1 className="ecc-page-title">Tenant Card</h1></Route>
          <Route path="/card/owner/:id"><h1 className="ecc-page-title">Owner Card</h1></Route>

          {/* Operations */}
          <Route path="/ops/accounting/overview"><h1 className="ecc-page-title">Accounting – Overview</h1></Route>
          <Route path="/ops/accounting/rent-collection"><h1 className="ecc-page-title">Rent Collection</h1></Route>
          <Route path="/ops/accounting/expenses"><h1 className="ecc-page-title">Expenses</h1></Route>
          <Route path="/ops/accounting/financial-reports"><h1 className="ecc-page-title">Financial Reports</h1></Route>
          <Route path="/ops/accounting/tenant-ledgers"><h1 className="ecc-page-title">Tenant Ledgers</h1></Route>
          <Route path="/ops/accounting/collections-dashboard"><h1 className="ecc-page-title">Collections Dashboard</h1></Route>
          <Route path="/ops/accounting/collections-log"><h1 className="ecc-page-title">Collections Log</h1></Route>
          <Route path="/ops/accounting/payment-plans"><h1 className="ecc-page-title">Payment Plans</h1></Route>
          <Route path="/ops/accounting/deposits"><h1 className="ecc-page-title">Deposits</h1></Route>
          <Route path="/ops/accounting/transfers"><h1 className="ecc-page-title">Transfers</h1></Route>
          <Route path="/ops/accounting/subsidized-housing"><h1 className="ecc-page-title">Subsidized Housing</h1></Route>
          <Route path="/ops/accounting/assistance-programs"><h1 className="ecc-page-title">Assistance Programs</h1></Route>

          <Route path="/ops/ai/risk-summary"><h1 className="ecc-page-title">AI Analytics – Risk Summary</h1></Route>
          <Route path="/ops/ai/renewal-forecasting"><h1 className="ecc-page-title">AI Analytics – Renewal Forecasting</h1></Route>
          <Route path="/ops/ai/vacancy-analytics"><h1 className="ecc-page-title">AI Analytics – Vacancy Analytics</h1></Route>
          <Route path="/ops/ai/ml-leasing-logs"><h1 className="ecc-page-title">AI Analytics – ML Leasing Logs</h1></Route>

          <Route path="/ops/legal/case-manager"><h1 className="ecc-page-title">Legal – Case Manager</h1></Route>
          <Route path="/ops/legal/advanced"><h1 className="ecc-page-title">Legal – Advanced Ops</h1></Route>
          <Route path="/ops/legal/docs"><h1 className="ecc-page-title">Legal Docs</h1></Route>
          <Route path="/ops/legal/attorney-reports"><h1 className="ecc-page-title">Attorney Reports</h1></Route>

          <Route path="/ops/maintenance/work-orders"><h1 className="ecc-page-title">Maintenance – Work Orders</h1></Route>
          <Route path="/ops/maintenance/vendors"><h1 className="ecc-page-title">Vendors</h1></Route>
          <Route path="/ops/maintenance/materials-inventory"><h1 className="ecc-page-title">Materials & Inventory</h1></Route>
          <Route path="/ops/maintenance/smart-routing"><h1 className="ecc-page-title">Smart Routing</h1></Route>
          <Route path="/ops/maintenance/ai-intelligence"><h1 className="ecc-page-title">Maintenance AI Intelligence</h1></Route>
          <Route path="/ops/maintenance/build-repair-projects"><h1 className="ecc-page-title">Build/Repair Projects</h1></Route>
          <Route path="/ops/maintenance/capital-projects"><h1 className="ecc-page-title">Capital Projects</h1></Route>

          <Route path="/ops/reports"><h1 className="ecc-page-title">Reports</h1></Route>

          {/* Growth */}
          <Route path="/growth/marketing"><h1 className="ecc-page-title">Marketing</h1></Route>

          {/* System */}
          <Route path="/system/automation"><h1 className="ecc-page-title">Automation</h1></Route>
          <Route path="/system/settings"><h1 className="ecc-page-title">Settings</h1></Route>

          {/* Data Management */}
          <Route path="/data/sync-audit"><h1 className="ecc-page-title">Sync Audit</h1></Route>
          <Route path="/data/sync-management"><h1 className="ecc-page-title">Sync Management</h1></Route>
          <Route path="/data/raw"><h1 className="ecc-page-title">Raw Data</h1></Route>
          <Route path="/data/sync-logs"><h1 className="ecc-page-title">Sync Logs</h1></Route>
          <Route path="/data/system-settings"><h1 className="ecc-page-title">System Settings</h1></Route>

          {/* Investor Portal */}
          <Route path="/investor/dashboard"><h1 className="ecc-page-title">Investor – Dashboard</h1></Route>
          <Route path="/investor/portfolio-analytics"><h1 className="ecc-page-title">Investor – Portfolio Analytics</h1></Route>
          <Route path="/investor/financial-reports"><h1 className="ecc-page-title">Investor – Financial Reports</h1></Route>

          {/* Integrations */}
          <Route path="/integrations/dropbox"><h1 className="ecc-page-title">Dropbox Files</h1></Route>
          <Route path="/integrations/corelogic"><h1 className="ecc-page-title">CoreLogic / MLS Grid</h1></Route>
          <Route path="/integrations/field-app"><h1 className="ecc-page-title">Field App</h1></Route>
          <Route path="/integrations/deal-room"><h1 className="ecc-page-title">Deal Room</h1></Route>

          {/* Redirect & Fallback */}
          <Route path="/"><Redirect to="/dashboard" /></Route>
          <Route><h1 className="ecc-page-title">Not Found</h1></Route>
        </Switch>
      </main>
    </div>
  );
}

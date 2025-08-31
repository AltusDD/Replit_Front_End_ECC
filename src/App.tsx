/* eslint-disable */
import React from "react";
import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import ApiProbe from "@/pages/tools/probe";
import Properties from "@/pages/portfolio/properties";
import Units from "@/pages/portfolio/units";
import Leases from "@/pages/portfolio/leases";
import Tenants from "@/pages/portfolio/tenants";
import Owners from "@/pages/portfolio/owners";
import CardsOverview from "@/pages/cards/overview";
import CardsDelinquencies from "@/pages/cards/delinquencies";
import CardsVacancy from "@/pages/cards/vacancy";
import OperationsAccounting from "@/pages/operations/accounting";
import OperationsLeasing from "@/pages/operations/leasing";
import OperationsMaintenance from "@/pages/operations/maintenance";
import OperationsMarketing from "@/pages/operations/marketing";

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/" component={()=><Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/portfolio/properties" component={Properties}/>
        <Route path="/portfolio/units" component={Units}/>
        <Route path="/portfolio/leases" component={Leases}/>
        <Route path="/portfolio/tenants" component={Tenants}/>
        <Route path="/portfolio/owners" component={Owners}/>
        <Route path="/cards/overview" component={CardsOverview}/>
        <Route path="/cards/delinquencies" component={CardsDelinquencies}/>
        <Route path="/cards/vacancy" component={CardsVacancy}/>
        <Route path="/operations/accounting" component={OperationsAccounting}/>
        <Route path="/operations/leasing" component={OperationsLeasing}/>
        <Route path="/operations/maintenance" component={OperationsMaintenance}/>
        <Route path="/operations/marketing" component={OperationsMarketing}/>
        <Route path="/tools/probe" component={ApiProbe}/>
        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}

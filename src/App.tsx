import React from 'react';
import { Route, Switch, Redirect } from 'wouter';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard';
import ApiProbe from './pages/tools/ApiProbe';
import Properties from './pages/portfolio/properties';
import Units from './pages/portfolio/units';
import Leases from './pages/portfolio/leases';
import Tenants from './pages/portfolio/tenants';
import Owners from './pages/portfolio/owners';

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/"><Redirect to="/dashboard"/></Route>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/portfolio/properties" component={Properties}/>
        <Route path="/portfolio/units" component={Units}/>
        <Route path="/portfolio/leases" component={Leases}/>
        <Route path="/portfolio/tenants" component={Tenants}/>
        <Route path="/portfolio/owners" component={Owners}/>
        <Route path="/tools/probe" component={ApiProbe}/>
        <Route> <div className="panel">Not found.</div> </Route>
      </Switch>
    </Layout>
  );
}

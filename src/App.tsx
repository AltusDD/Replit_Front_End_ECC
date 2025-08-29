import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import Dashboard from '@/pages/dashboard';
import ApiProbe from '@/pages/tools/ApiProbe';
import Properties from '@/pages/portfolio/properties';
import Units from '@/pages/portfolio/units';
import Leases from '@/pages/portfolio/leases';
import Tenants from '@/pages/portfolio/tenants';
import Owners from '@/pages/portfolio/owners';

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => setLocation(to), [to, setLocation]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Switch>
          <Route path="/" component={() => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" component={Dashboard} />

          <Route path="/tools/probe" component={ApiProbe} />

          <Route path="/portfolio/properties" component={Properties} />
          <Route path="/portfolio/units" component={Units} />
          <Route path="/portfolio/leases" component={Leases} />
          <Route path="/portfolio/tenants" component={Tenants} />
          <Route path="/portfolio/owners" component={Owners} />
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
}

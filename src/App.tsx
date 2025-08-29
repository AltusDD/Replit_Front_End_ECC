import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import Dashboard from '@/pages/dashboard/index';
import ApiProbe from '@/components/ApiProbe';
import Properties from '@/pages/portfolio/properties/index';
import Units from '@/pages/portfolio/units/index';
import Leases from '@/pages/portfolio/leases/index';
import Tenants from '@/pages/portfolio/tenants/index';
import Owners from '@/pages/portfolio/owners/index';

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

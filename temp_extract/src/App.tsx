set -euo pipefail

cat > src/App.tsx <<'TSX'
import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import ApiProbe from "@/pages/tools/probe";
import Properties from "@/pages/portfolio/properties";
import Units from "@/pages/portfolio/units";
import Leases from "@/pages/portfolio/leases";
import Tenants from "@/pages/portfolio/tenants";
import Owners from "@/pages/portfolio/owners";
import Wip from "@/pages/wip";

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/portfolio/properties" component={Properties} />
        <Route path="/portfolio/units" component={Units} />
        <Route path="/portfolio/leases" component={Leases} />
        <Route path="/portfolio/tenants" component={Tenants} />
        <Route path="/portfolio/owners" component={Owners} />
        <Route path="/tools/probe" component={ApiProbe} />
        <Route path="/wip/:rest*"><Wip /></Route>
        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}
TSX

pkill -f vite >/dev/null 2>&1 || true
npm run dev

import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard/index";
import ApiProbe from "@/pages/tools/probe";
import Properties from "@/pages/portfolio/properties/index";
import Units from "@/pages/portfolio/units/index";
import Leases from "@/pages/portfolio/leases/index";
import Tenants from "@/pages/portfolio/tenants/index";
import Owners from "@/pages/portfolio/owners/index";
import Inbox from "@/pages/cards/inbox";
import Tasks from "@/pages/cards/tasks";
import Opportunities from "@/pages/cards/opportunities";
import Accounting from "@/pages/ops/accounting/index";
import Leasing from "@/pages/ops/leasing/index";
import Maintenance from "@/pages/ops/maintenance/index";
import Growth from "@/pages/growth/index";
import System from "@/pages/system/index";
import DataManagement from "@/pages/data/index";
import InvestorPortal from "@/pages/investor/index";
import Integrations from "@/pages/integrations/index";

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
        <Route path="/cards/inbox" component={Inbox}/>
        <Route path="/cards/tasks" component={Tasks}/>
        <Route path="/cards/opportunities" component={Opportunities}/>
        <Route path="/ops/accounting" component={Accounting}/>
        <Route path="/ops/leasing" component={Leasing}/>
        <Route path="/ops/maintenance" component={Maintenance}/>
        <Route path="/growth" component={Growth}/>
        <Route path="/system" component={System}/>
        <Route path="/data" component={DataManagement}/>
        <Route path="/investor" component={InvestorPortal}/>
        <Route path="/integrations" component={Integrations}/>
        <Route path="/tools/probe" component={ApiProbe}/>
        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}
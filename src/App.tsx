import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import ApiProbe from "@/pages/tools/probe";
import PropertiesPage from "@/pages/portfolio/properties";
import UnitsPage from "@/pages/portfolio/units";
import LeasesPage from "@/pages/portfolio/leases";
import TenantsPage from "@/pages/portfolio/tenants";
import OwnersPage from "@/pages/portfolio/owners";
import PropertyCard from "@/pages/card/property";
import UnitCard from "@/pages/card/unit";
import LeaseCard from "@/pages/card/lease";
import TenantCard from "@/pages/card/tenant";
import OwnerCard from "@/pages/card/owner";

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/" component={()=><Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/portfolio/properties" component={PropertiesPage}/>
        <Route path="/portfolio/units" component={UnitsPage}/>
        <Route path="/portfolio/leases" component={LeasesPage}/>
        <Route path="/portfolio/tenants" component={TenantsPage}/>
        <Route path="/portfolio/owners" component={OwnersPage}/>
        <Route path="/card/property/:id" component={PropertyCard}/>
        <Route path="/card/unit/:id" component={UnitCard}/>
        <Route path="/card/lease/:id" component={LeaseCard}/>
        <Route path="/card/tenant/:id" component={TenantCard}/>
        <Route path="/card/owner/:id" component={OwnerCard}/>
        <Route path="/tools/probe" component={ApiProbe}/>
        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}

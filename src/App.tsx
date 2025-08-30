import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import ApiProbe from "@/pages/tools/probe";
import Properties from "@/pages/portfolio/properties";
import Units from "@/pages/portfolio/units";
import Leases from "@/pages/portfolio/leases";
import Tenants from "@/pages/portfolio/tenants";
import Owners from "@/pages/portfolio/owners";

// Operations - Accounting  
import AccountingOverview from "@/pages/ops/accounting/overview";
import CollectionsDashboard from "@/pages/ops/accounting/collections-dashboard";
import RentCollection from "@/pages/ops/accounting/rent-collection";
import TenantLedgers from "@/pages/ops/accounting/tenant-ledgers";
import FinancialReports from "@/pages/ops/accounting/financial-reports";
import Deposits from "@/pages/ops/accounting/deposits";
import Expenses from "@/pages/ops/accounting/expenses";
import PaymentPlans from "@/pages/ops/accounting/payment-plans";
import Transfers from "@/pages/ops/accounting/transfers";

// Operations - AI
import RiskSummary from "@/pages/ops/ai/risk-summary";
import VacancyAnalytics from "@/pages/ops/ai/vacancy-analytics";
import RenewalForecasting from "@/pages/ops/ai/renewal-forecasting";
import MLLeasingLogs from "@/pages/ops/ai/ml-leasing-logs";

// Operations - Work Orders
import WorkOrders from "@/pages/ops/work/work-orders";
import CapitalProjects from "@/pages/ops/work/capital-projects";
import WorkVendors from "@/pages/ops/work/vendors";
import BuildRepairProjects from "@/pages/ops/work/build-repair-projects";
import AIIntelligence from "@/pages/ops/work/ai-intelligence";
import SmartRouting from "@/pages/ops/work/smart-routing";
import MaterialsInventory from "@/pages/ops/work/materials-inventory";

// Operations - Legal
import LegalDocs from "@/pages/ops/legal/docs";
import AttorneyReports from "@/pages/ops/legal/attorney-reports";
import CaseManager from "@/pages/ops/legal/case-manager";
import LegalAdvanced from "@/pages/ops/legal/advanced";

// Operations - Communications
import CommsLogs from "@/pages/ops/comms/logs";
import CommsQueue from "@/pages/ops/comms/queue";
import CommsTemplates from "@/pages/ops/comms/templates";

// System
import SystemSettings from "@/pages/system/settings";
import SystemAutomation from "@/pages/system/automation";

// Growth
import GrowthMarketing from "@/pages/growth/marketing";
import GrowthInventory from "@/pages/growth/inventory";

// Data Management
import DataRaw from "@/pages/data/raw";
import DataSyncAudit from "@/pages/data/sync-audit";
import DataSyncLogs from "@/pages/data/sync-logs";

// Investor Portal
import InvestorDashboard from "@/pages/investor/dashboard";
import InvestorFinancialReports from "@/pages/investor/financial-reports";
import PortfolioAnalytics from "@/pages/investor/portfolio-analytics";

// Integrations
import CoreLogic from "@/pages/integrations/corelogic";
import FieldApp from "@/pages/integrations/field-app";
import Dropbox from "@/pages/integrations/dropbox";
import DealRoom from "@/pages/integrations/deal-room";

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/" component={()=><Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard}/>
        
        {/* Portfolio */}
        <Route path="/portfolio/properties" component={Properties}/>
        <Route path="/portfolio/units" component={Units}/>
        <Route path="/portfolio/leases" component={Leases}/>
        <Route path="/portfolio/tenants" component={Tenants}/>
        <Route path="/portfolio/owners" component={Owners}/>

        {/* Operations - Accounting */}
        <Route path="/ops/accounting/overview" component={AccountingOverview}/>
        <Route path="/ops/accounting/collections-dashboard" component={CollectionsDashboard}/>
        <Route path="/ops/accounting/rent-collection" component={RentCollection}/>
        <Route path="/ops/accounting/tenant-ledgers" component={TenantLedgers}/>
        <Route path="/ops/accounting/financial-reports" component={FinancialReports}/>
        <Route path="/ops/accounting/deposits" component={Deposits}/>
        <Route path="/ops/accounting/expenses" component={Expenses}/>
        <Route path="/ops/accounting/payment-plans" component={PaymentPlans}/>
        <Route path="/ops/accounting/transfers" component={Transfers}/>

        {/* Operations - AI */}
        <Route path="/ops/ai/risk-summary" component={RiskSummary}/>
        <Route path="/ops/ai/vacancy-analytics" component={VacancyAnalytics}/>
        <Route path="/ops/ai/renewal-forecasting" component={RenewalForecasting}/>
        <Route path="/ops/ai/ml-leasing-logs" component={MLLeasingLogs}/>

        {/* Operations - Work */}
        <Route path="/ops/work/work-orders" component={WorkOrders}/>
        <Route path="/ops/work/capital-projects" component={CapitalProjects}/>
        <Route path="/ops/work/vendors" component={WorkVendors}/>
        <Route path="/ops/work/build-repair-projects" component={BuildRepairProjects}/>
        <Route path="/ops/work/ai-intelligence" component={AIIntelligence}/>
        <Route path="/ops/work/smart-routing" component={SmartRouting}/>
        <Route path="/ops/work/materials-inventory" component={MaterialsInventory}/>

        {/* Operations - Legal */}
        <Route path="/ops/legal/docs" component={LegalDocs}/>
        <Route path="/ops/legal/attorney-reports" component={AttorneyReports}/>
        <Route path="/ops/legal/case-manager" component={CaseManager}/>
        <Route path="/ops/legal/advanced" component={LegalAdvanced}/>

        {/* Operations - Communications */}
        <Route path="/ops/comms/logs" component={CommsLogs}/>
        <Route path="/ops/comms/queue" component={CommsQueue}/>
        <Route path="/ops/comms/templates" component={CommsTemplates}/>

        {/* System */}
        <Route path="/system/settings" component={SystemSettings}/>
        <Route path="/system/automation" component={SystemAutomation}/>

        {/* Growth */}
        <Route path="/growth/marketing" component={GrowthMarketing}/>
        <Route path="/growth/inventory" component={GrowthInventory}/>

        {/* Data Management */}
        <Route path="/data/raw" component={DataRaw}/>
        <Route path="/data/sync-audit" component={DataSyncAudit}/>
        <Route path="/data/sync-logs" component={DataSyncLogs}/>

        {/* Investor Portal */}
        <Route path="/investor/dashboard" component={InvestorDashboard}/>
        <Route path="/investor/financial-reports" component={InvestorFinancialReports}/>
        <Route path="/investor/portfolio-analytics" component={PortfolioAnalytics}/>

        {/* Integrations */}
        <Route path="/integrations/corelogic" component={CoreLogic}/>
        <Route path="/integrations/field-app" component={FieldApp}/>
        <Route path="/integrations/dropbox" component={Dropbox}/>
        <Route path="/integrations/deal-room" component={DealRoom}/>

        {/* Tools */}
        <Route path="/tools/probe" component={ApiProbe}/>

        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}
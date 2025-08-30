import { Route, Switch, Redirect } from "wouter";
import Layout from "@/components/layout/Layout";

// Dashboard
import Dashboard from "@/pages/dashboard/index";

// Portfolio V3
import Properties from "@/pages/portfolio/properties/index";
import Units from "@/pages/portfolio/units/index";
import Leases from "@/pages/portfolio/leases/index";
import Tenants from "@/pages/portfolio/tenants/index";
import Owners from "@/pages/portfolio/owners/index";

// Cards
import PropertyCard from "@/pages/card/property/index";
import UnitCard from "@/pages/card/unit/index";
import LeaseCard from "@/pages/card/lease/index";
import TenantCard from "@/pages/card/tenant/index";
import OwnerCard from "@/pages/card/owner/index";

// Operations - Accounting
import AccountingOverview from "@/pages/ops/accounting/overview";
import RentCollection from "@/pages/ops/accounting/rent-collection";
import Expenses from "@/pages/ops/accounting/expenses";
import FinancialReports from "@/pages/ops/accounting/financial-reports";
import TenantLedgers from "@/pages/ops/accounting/tenant-ledgers";
import CollectionsDashboard from "@/pages/ops/accounting/collections-dashboard";
import CollectionsLog from "@/pages/ops/accounting/collections-log";
import PaymentPlans from "@/pages/ops/accounting/payment-plans";
import Deposits from "@/pages/ops/accounting/deposits";
import Transfers from "@/pages/ops/accounting/transfers";
import SubsidizedHousing from "@/pages/ops/accounting/subsidized-housing";
import AssistancePrograms from "@/pages/ops/accounting/assistance-programs";

// Operations - AI Analytics
import RiskSummary from "@/pages/ops/ai/risk-summary";
import RenewalForecasting from "@/pages/ops/ai/renewal-forecasting";
import VacancyAnalytics from "@/pages/ops/ai/vacancy-analytics";
import MLLeasingLogs from "@/pages/ops/ai/ml-leasing-logs";

// Operations - Legal Tracker
import CaseManager from "@/pages/ops/legal/case-manager";
import AdvancedLegalOps from "@/pages/ops/legal/advanced";
import LegalDocs from "@/pages/ops/legal/docs";
import AttorneyReports from "@/pages/ops/legal/attorney-reports";

// Operations - Communication
import Queue from "@/pages/ops/comms/queue";
import Templates from "@/pages/ops/comms/templates";
import Logs from "@/pages/ops/comms/logs";

// Operations - Work Orders
import WorkOrders from "@/pages/ops/work/work-orders";
import Vendors from "@/pages/ops/work/vendors";
import MaterialsInventory from "@/pages/ops/work/materials-inventory";
import SmartRouting from "@/pages/ops/work/smart-routing";
import AIIntelligence from "@/pages/ops/work/ai-intelligence";
import BuildRepairProjects from "@/pages/ops/work/build-repair-projects";
import CapitalProjects from "@/pages/ops/work/capital-projects";

// Operations - Reports
import Reports from "@/pages/ops/reports";

// Growth
import Inventory from "@/pages/growth/inventory";
import Marketing from "@/pages/growth/marketing";

// System
import Automation from "@/pages/system/automation";
import Settings from "@/pages/system/settings";

// Data Management
import SyncAudit from "@/pages/data/sync-audit";
import SyncManagement from "@/pages/data/sync-management";
import RawData from "@/pages/data/raw";
import SyncLogs from "@/pages/data/sync-logs";
import SystemSettings from "@/pages/data/system-settings";

// Investor Portal
import InvestorDashboard from "@/pages/investor/dashboard";
import PortfolioAnalytics from "@/pages/investor/portfolio-analytics";
import InvestorFinancialReports from "@/pages/investor/financial-reports";

// Integrations
import DropboxFiles from "@/pages/integrations/dropbox";
import CoreLogicMLSGrid from "@/pages/integrations/corelogic";
import FieldAppLink from "@/pages/integrations/field-app";
import DealRoomLink from "@/pages/integrations/deal-room";

// Tools
import ApiProbe from "@/pages/tools/probe";

export default function App(){
  return (
    <Layout>
      <Switch>
        <Route path="/" component={()=><Redirect to="/dashboard" />} />
        
        {/* Primary */}
        <Route path="/dashboard" component={Dashboard}/>
        
        {/* Portfolio V3 */}
        <Route path="/portfolio/properties" component={Properties}/>
        <Route path="/portfolio/units" component={Units}/>
        <Route path="/portfolio/leases" component={Leases}/>
        <Route path="/portfolio/tenants" component={Tenants}/>
        <Route path="/portfolio/owners" component={Owners}/>
        
        {/* Cards */}
        <Route path="/card/property/:id" component={PropertyCard}/>
        <Route path="/card/unit/:id" component={UnitCard}/>
        <Route path="/card/lease/:id" component={LeaseCard}/>
        <Route path="/card/tenant/:id" component={TenantCard}/>
        <Route path="/card/owner/:id" component={OwnerCard}/>
        
        {/* Operations - Accounting */}
        <Route path="/ops/accounting/overview" component={AccountingOverview}/>
        <Route path="/ops/accounting/rent-collection" component={RentCollection}/>
        <Route path="/ops/accounting/expenses" component={Expenses}/>
        <Route path="/ops/accounting/financial-reports" component={FinancialReports}/>
        <Route path="/ops/accounting/tenant-ledgers" component={TenantLedgers}/>
        <Route path="/ops/accounting/collections-dashboard" component={CollectionsDashboard}/>
        <Route path="/ops/accounting/collections-log" component={CollectionsLog}/>
        <Route path="/ops/accounting/payment-plans" component={PaymentPlans}/>
        <Route path="/ops/accounting/deposits" component={Deposits}/>
        <Route path="/ops/accounting/transfers" component={Transfers}/>
        <Route path="/ops/accounting/subsidized-housing" component={SubsidizedHousing}/>
        <Route path="/ops/accounting/assistance-programs" component={AssistancePrograms}/>
        
        {/* Operations - AI Analytics */}
        <Route path="/ops/ai/risk-summary" component={RiskSummary}/>
        <Route path="/ops/ai/renewal-forecasting" component={RenewalForecasting}/>
        <Route path="/ops/ai/vacancy-analytics" component={VacancyAnalytics}/>
        <Route path="/ops/ai/ml-leasing-logs" component={MLLeasingLogs}/>
        
        {/* Operations - Legal Tracker */}
        <Route path="/ops/legal/case-manager" component={CaseManager}/>
        <Route path="/ops/legal/advanced" component={AdvancedLegalOps}/>
        <Route path="/ops/legal/docs" component={LegalDocs}/>
        <Route path="/ops/legal/attorney-reports" component={AttorneyReports}/>
        
        {/* Operations - Communication */}
        <Route path="/ops/comms/queue" component={Queue}/>
        <Route path="/ops/comms/templates" component={Templates}/>
        <Route path="/ops/comms/logs" component={Logs}/>
        
        {/* Operations - Work Orders */}
        <Route path="/ops/work/work-orders" component={WorkOrders}/>
        <Route path="/ops/work/vendors" component={Vendors}/>
        <Route path="/ops/work/materials-inventory" component={MaterialsInventory}/>
        <Route path="/ops/work/smart-routing" component={SmartRouting}/>
        <Route path="/ops/work/ai-intelligence" component={AIIntelligence}/>
        <Route path="/ops/work/build-repair-projects" component={BuildRepairProjects}/>
        <Route path="/ops/work/capital-projects" component={CapitalProjects}/>
        
        {/* Operations - Reports */}
        <Route path="/ops/reports" component={Reports}/>
        
        {/* Growth */}
        <Route path="/growth/inventory" component={Inventory}/>
        <Route path="/growth/marketing" component={Marketing}/>
        
        {/* System */}
        <Route path="/system/automation" component={Automation}/>
        <Route path="/system/settings" component={Settings}/>
        
        {/* Data Management */}
        <Route path="/data/sync-audit" component={SyncAudit}/>
        <Route path="/data/sync-management" component={SyncManagement}/>
        <Route path="/data/raw" component={RawData}/>
        <Route path="/data/sync-logs" component={SyncLogs}/>
        <Route path="/data/system-settings" component={SystemSettings}/>
        
        {/* Investor Portal */}
        <Route path="/investor/dashboard" component={InvestorDashboard}/>
        <Route path="/investor/portfolio-analytics" component={PortfolioAnalytics}/>
        <Route path="/investor/financial-reports" component={InvestorFinancialReports}/>
        
        {/* Integrations */}
        <Route path="/integrations/dropbox" component={DropboxFiles}/>
        <Route path="/integrations/corelogic" component={CoreLogicMLSGrid}/>
        <Route path="/integrations/field-app" component={FieldAppLink}/>
        <Route path="/integrations/deal-room" component={DealRoomLink}/>
        
        {/* Tools */}
        <Route path="/tools/probe" component={ApiProbe}/>
        
        <Route>404 Not Found</Route>
      </Switch>
    </Layout>
  );
}
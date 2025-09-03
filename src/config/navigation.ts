// Canonical, data-driven nav used by Sidebar
// Uses lucide-react icon names
export type IconName =
  | "LayoutDashboard"
  | "Boxes"
  | "FileText"
  | "Shield"
  | "Scale"
  | "MessageSquare"
  | "Hammer"
  | "BarChart3"
  | "Settings"
  | "Database"
  | "PieChart"
  | "Link2";

export type NavChild = { title: string; path: string; icon?: IconName; badgeKey?: string };
export type NavParent = { title: string; icon: IconName; path?: string; children?: NavChild[]; badgeKey?: string };

export const NAV_SECTIONS: NavParent[] = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    title: "Portfolio V3",
    icon: "Boxes",
    children: [
      { title: "Properties", path: "/portfolio/properties", icon: "FileText" },
      { title: "Units", path: "/portfolio/units", icon: "FileText" },
      { title: "Leases", path: "/portfolio/leases", icon: "FileText" },
      { title: "Tenants", path: "/portfolio/tenants", icon: "FileText" },
      { title: "Owners", path: "/portfolio/owners", icon: "FileText" },
    ],
  },
  { title: "Accounting", icon: "FileText", children: [
      { title: "Overview", path: "/ops/accounting/overview", icon: "FileText" },
      { title: "Rent Collection", path: "/ops/accounting/rent-collection", icon: "FileText" },
      { title: "Expenses", path: "/ops/accounting/expenses", icon: "FileText" },
      { title: "Financial Reports", path: "/ops/accounting/financial-reports", icon: "FileText" },
      { title: "Tenant Ledgers", path: "/ops/accounting/tenant-ledgers", icon: "FileText" },
      { title: "Collections Dashboard", path: "/ops/accounting/collections-dashboard", icon: "FileText" },
      { title: "Collections Log", path: "/ops/accounting/collections-log", icon: "FileText" },
      { title: "Payment Plans", path: "/ops/accounting/payment-plans", icon: "FileText" },
      { title: "Deposits", path: "/ops/accounting/deposits", icon: "FileText" },
      { title: "Transfers", path: "/ops/accounting/transfers", icon: "FileText" },
      { title: "Subsidized Housing", path: "/ops/accounting/subsidized-housing", icon: "FileText" },
      { title: "Assistance Programs", path: "/ops/accounting/assistance-programs", icon: "FileText" },
    ],
  },
  { title: "AI Analytics", icon: "Shield", children: [
      { title: "Risk Summary", path: "/ops/ai/risk-summary" },
      { title: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting" },
      { title: "Vacancy Analytics", path: "/ops/ai/vacancy-analytics" },
      { title: "ML Leasing Logs", path: "/ops/ai/ml-leasing-logs" },
    ],
  },
  { title: "Legal Tracker", icon: "Scale", children: [
      { title: "Case Manager", path: "/ops/legal/case-manager" },
      { title: "Advanced Legal Ops", path: "/ops/legal/advanced" },
      { title: "Legal Docs", path: "/ops/legal/docs" },
      { title: "Attorney Reports", path: "/ops/legal/attorney-reports" },
    ],
  },
  { title: "Communication", icon: "MessageSquare", children: [
      { title: "Queue", path: "/ops/comms/queue" },
      { title: "Templates", path: "/ops/comms/templates" },
      { title: "Logs", path: "/ops/comms/logs" },
    ],
  },
  {
    title: "Construction & Repair",
    icon: "Hammer",
    children: [
      { title: "Work Orders", path: "/ops/maintenance/work-orders" },
      { title: "Vendors", path: "/ops/maintenance/vendors" },
      { title: "Materials & Inventory", path: "/ops/maintenance/materials-inventory" },
      { title: "Smart Routing", path: "/ops/maintenance/smart-routing" },
      { title: "AI Intelligence", path: "/ops/maintenance/ai-intelligence" },
      { title: "Build/Repair Projects", path: "/ops/maintenance/build-repair-projects" },
      { title: "Capital Projects", path: "/ops/maintenance/capital-projects" },
    ],
  },
  {
    title: "Reports",
    icon: "BarChart3",
    children: [
      { title: "Reports Home", path: "/ops/reports" },
      { title: "Create Report", path: "/ops/reports/create" },
      { title: "Saved Reports", path: "/ops/reports/saved" },
    ],
  },
  { title: "Growth", icon: "PieChart", children: [
      { title: "Marketing", path: "/growth/marketing" },
    ],
  },
  { title: "System", icon: "Settings", children: [
      { title: "Automation", path: "/system/automation" },
      { title: "Settings", path: "/system/settings" },
    ],
  },
  { title: "Data Management", icon: "Database", children: [
      { title: "Sync Audit", path: "/data/sync-audit" },
      { title: "Sync Management", path: "/data/sync-management" },
      { title: "Raw Data", path: "/data/raw" },
      { title: "Sync Logs", path: "/data/sync-logs" },
      { title: "System Settings", path: "/data/system-settings" },
    ],
  },
  { title: "Investor Portal", icon: "PieChart", children: [
      { title: "Dashboard", path: "/investor/dashboard" },
      { title: "Portfolio Analytics", path: "/investor/portfolio-analytics" },
      { title: "Financial Reports", path: "/investor/financial-reports" },
    ],
  },
  { title: "Integrations", icon: "Link2", children: [
      { title: "Dropbox Files", path: "/integrations/dropbox" },
      { title: "CoreLogic / MLS Grid", path: "/integrations/corelogic" },
      { title: "Field App Link", path: "/integrations/field-app" },
      { title: "Deal Room Link", path: "/integrations/deal-room" },
    ],
  },
];

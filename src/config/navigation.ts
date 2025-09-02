// Canonical NAV_SECTIONS for ECC (SSOT)
// Aligns with "Canonical Navigation (Markdown)" and LAW guardrails.
// Icons: lucide-react names

export type IconName =
  | "LayoutDashboard"
  | "Home"
  | "Building2"
  | "Warehouse"
  | "FileSignature"
  | "Users2"
  | "UserCircle"
  | "IdCard"
  | "ScrollText"
  | "Briefcase"
  | "BarChart3"
  | "Scale"
  | "FolderKanban"
  | "FileText"
  | "Mail"
  | "Inbox"
  | "Hammer"
  | "Wrench"
  | "PackageSearch"
  | "Map"
  | "Cpu"
  | "TrendingUp"
  | "Database"
  | "Settings"
  | "ShieldCheck"
  | "FileStack"
  | "Cloud"
  | "Link"
  | "Users"
  | "PieChart"
  | "Files"
  | "Cog"
  | "Bot"
  | "FileCode";

export type NavChild = {
  title: string;
  path: string;
  icon?: IconName;
  badgeKey?: string;
};

export type NavParent = {
  title: string;
  path?: string;
  icon: IconName;
  badgeKey?: string;
  children?: NavChild[];
};

export const NAV_SECTIONS: NavParent[] = [
  // Primary
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
  },

  // Portfolio V3
  {
    title: "Portfolio V3",
    icon: "Briefcase",
    children: [
      { title: "Properties", path: "/portfolio/properties", icon: "Building2", badgeKey: "properties" },
      { title: "Units",      path: "/portfolio/units",      icon: "Warehouse",  badgeKey: "units" },
      { title: "Leases",     path: "/portfolio/leases",     icon: "FileSignature", badgeKey: "leases" },
      { title: "Tenants",    path: "/portfolio/tenants",    icon: "Users2",     badgeKey: "tenants" },
      { title: "Owners",     path: "/portfolio/owners",     icon: "UserCircle", badgeKey: "owners" },
    ],
  },

  // Cards (Entity Hubs)
  {
    title: "Cards",
    icon: "IdCard",
    children: [
      { title: "Property Card", path: "/card/property/:id", icon: "Building2" },
      { title: "Unit Card",     path: "/card/unit/:id",     icon: "Warehouse" },
      { title: "Lease Card",    path: "/card/lease/:id",    icon: "FileSignature" },
      { title: "Tenant Card",   path: "/card/tenant/:id",   icon: "Users2" },
      { title: "Owner Card",    path: "/card/owner/:id",    icon: "UserCircle" },
    ],
  },

  // Operations
  {
    title: "Accounting",
    icon: "FileText",
    children: [
      { title: "Overview",             path: "/ops/accounting/overview",            icon: "BarChart3" },
      { title: "Rent Collection",      path: "/ops/accounting/rent-collection",     icon: "Inbox" },
      { title: "Expenses",             path: "/ops/accounting/expenses",            icon: "Files" },
      { title: "Financial Reports",    path: "/ops/accounting/financial-reports",   icon: "PieChart" },
      { title: "Tenant Ledgers",       path: "/ops/accounting/tenant-ledgers",      icon: "ScrollText" },
      { title: "Collections Dashboard",path: "/ops/accounting/collections-dashboard", icon: "TrendingUp" },
      { title: "Collections Log",      path: "/ops/accounting/collections-log",     icon: "FolderKanban" },
      { title: "Payment Plans",        path: "/ops/accounting/payment-plans",       icon: "FileSignature" },
      { title: "Deposits",             path: "/ops/accounting/deposits",            icon: "Database" },
      { title: "Transfers",            path: "/ops/accounting/transfers",           icon: "Database" },
      { title: "Subsidized Housing",   path: "/ops/accounting/subsidized-housing",  icon: "Users" },
      { title: "Assistance Programs",  path: "/ops/accounting/assistance-programs", icon: "Users2" },
    ],
  },
  {
    title: "AI Analytics",
    icon: "Bot",
    children: [
      { title: "Risk Summary",         path: "/ops/ai/risk-summary",        icon: "ShieldCheck" },
      { title: "Renewal Forecasting",  path: "/ops/ai/renewal-forecasting", icon: "TrendingUp" },
      { title: "Vacancy Analytics",    path: "/ops/ai/vacancy-analytics",   icon: "BarChart3" },
      { title: "ML Leasing Logs",      path: "/ops/ai/ml-leasing-logs",     icon: "FileCode" },
    ],
  },
  {
    title: "Legal Tracker",
    icon: "Scale",
    children: [
      { title: "Case Manager",         path: "/ops/legal/case-manager",     icon: "FolderKanban" },
      { title: "Advanced Legal Ops",   path: "/ops/legal/advanced",         icon: "Scale" },
      { title: "Legal Docs",           path: "/ops/legal/docs",             icon: "FileText" },
      { title: "Attorney Reports",     path: "/ops/legal/attorney-reports", icon: "FileText" },
    ],
  },
  {
    title: "Communication",
    icon: "Mail",
    children: [
      { title: "Queue",                path: "/ops/comms/queue",            icon: "Inbox" },
      { title: "Templates",            path: "/ops/comms/templates",        icon: "Files" },
      { title: "Logs",                 path: "/ops/comms/logs",             icon: "FileText" },
    ],
  },
  {
    title: "Work Orders",
    icon: "Hammer",
    children: [
      { title: "Work Orders",          path: "/ops/work/work-orders",       icon: "Wrench" },
      { title: "Vendors",              path: "/ops/work/vendors",           icon: "Users" },
      { title: "Materials & Inventory",path: "/ops/work/materials-inventory", icon: "PackageSearch" },
      { title: "Smart Routing",        path: "/ops/work/smart-routing",     icon: "Map" },
      { title: "AI Intelligence",      path: "/ops/work/ai-intelligence",   icon: "Cpu" },
      { title: "Build/Repair Projects",path: "/ops/work/build-repair-projects", icon: "FolderKanban" },
      { title: "Capital Projects",     path: "/ops/work/capital-projects",  icon: "FolderKanban" },
    ],
  },
  {
    title: "Reports",
    path: "/ops/reports",
    icon: "BarChart3",
  },

  // Growth
  {
    title: "Growth",
    icon: "TrendingUp",
    children: [
      { title: "Inventory", path: "/growth/inventory", icon: "Files" },
      { title: "Marketing", path: "/growth/marketing", icon: "Mail" },
    ],
  },

  // System
  {
    title: "System",
    icon: "Settings",
    children: [
      { title: "Automation", path: "/system/automation", icon: "Bot" },
      { title: "Settings",   path: "/system/settings",   icon: "Cog" },
    ],
  },

  // Data Management
  {
    title: "Data Management",
    icon: "Database",
    children: [
      { title: "Sync Audit",      path: "/data/sync-audit",      icon: "ShieldCheck" },
      { title: "Sync Management", path: "/data/sync-management", icon: "Database" },
      { title: "Raw Data",        path: "/data/raw",             icon: "FileStack" },
      { title: "Sync Logs",       path: "/data/sync-logs",       icon: "FileText" },
      { title: "System Settings", path: "/data/system-settings", icon: "Settings" },
    ],
  },

  // Investor Portal
  {
    title: "Investor Portal",
    icon: "PieChart",
    children: [
      { title: "Dashboard",         path: "/investor/dashboard",           icon: "LayoutDashboard" },
      { title: "Portfolio Analytics", path: "/investor/portfolio-analytics", icon: "BarChart3" },
      { title: "Financial Reports", path: "/investor/financial-reports",   icon: "FileText" },
    ],
  },

  // Integrations
  {
    title: "Integrations",
    icon: "Link",
    children: [
      { title: "Dropbox Files",      path: "/integrations/dropbox",     icon: "Cloud" },
      { title: "CoreLogic / MLS Grid", path: "/integrations/corelogic", icon: "Database" },
      { title: "Field App Link",     path: "/integrations/field-app",   icon: "Link" },
      { title: "Deal Room Link",     path: "/integrations/deal-room",   icon: "Link" },
    ],
  },
];

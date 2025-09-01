// src/components/layout/navConfig.ts
// Single source of truth for the sidebar tree.
// Icon names are lucide-react exports (strings).

export type NavItem = {
  label: string;
  path?: string;
  icon: string;
  children?: NavItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Primary",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "Home" },
    ],
  },

  {
    // RENAMED: "Portfolio V3" → "Managed Assets"
    label: "Managed Assets",
    items: [
      {
        // Parent reads “Portfolio”
        label: "Portfolio",
        icon: "LayoutGrid",
        path: "/portfolio",
        children: [
          { label: "Properties", path: "/portfolio/properties", icon: "Building2" },
          { label: "Units",       path: "/portfolio/units",       icon: "House" },
          { label: "Leases",      path: "/portfolio/leases",      icon: "ScrollText" },
          { label: "Tenants",     path: "/portfolio/tenants",     icon: "Users" },
          { label: "Owners",      path: "/portfolio/owners",      icon: "UserSquare2" },
        ],
      },
    ],
  },

  // NOTE: “Cards (Entity Hubs)” is intentionally removed from the sidebar.
  // Cards require an :id to be meaningful and are opened by double-click from tables.

  {
    label: "Operations",
    items: [
      {
        label: "Accounting",
        icon: "Calculator",
        path: "/ops/accounting",
        children: [
          { label: "Overview",               path: "/ops/accounting/overview",              icon: "Gauge" },
          { label: "Rent Collection",        path: "/ops/accounting/rent-collection",       icon: "CreditCard" },
          { label: "Expenses",               path: "/ops/accounting/expenses",              icon: "FileMinus2" },
          { label: "Financial Reports",      path: "/ops/accounting/financial-reports",     icon: "ChartColumnIncreasing" },
          { label: "Tenant Ledgers",         path: "/ops/accounting/tenant-ledgers",        icon: "BookOpenCheck" },
          { label: "Collections Dashboard",  path: "/ops/accounting/collections-dashboard", icon: "SquareChartGantt" },
          { label: "Collections Log",        path: "/ops/accounting/collections-log",       icon: "ClipboardList" },
          { label: "Payment Plans",          path: "/ops/accounting/payment-plans",         icon: "CalendarClock" },
          { label: "Deposits",               path: "/ops/accounting/deposits",              icon: "PiggyBank" },
          { label: "Transfers",              path: "/ops/accounting/transfers",             icon: "ArrowLeftRight" },
          // Consolidated naming
          { label: "Assistance & Subsidy Programs", path: "/ops/accounting/assistance-programs", icon: "Handshake" },
        ],
      },

      {
        label: "AI Analytics",
        icon: "BrainCircuit",
        path: "/ops/ai",
        children: [
          { label: "Risk Summary",         path: "/ops/ai/risk-summary",         icon: "ShieldAlert" },
          { label: "Renewal Forecasting",  path: "/ops/ai/renewal-forecasting",  icon: "TrendingUp" },
          { label: "Vacancy Analytics",    path: "/ops/ai/vacancy-analytics",    icon: "PieChart" },
          { label: "ML Leasing Logs",      path: "/ops/ai/ml-leasing-logs",      icon: "ListTree" },
        ],
      },

      {
        label: "Legal Tracker",
        icon: "Gavel",
        path: "/ops/legal",
        children: [
          { label: "Case Manager",     path: "/ops/legal/case-manager",     icon: "FolderKanban" },
          { label: "Advanced Legal Ops", path: "/ops/legal/advanced",       icon: "Scales" },
          { label: "Legal Docs",       path: "/ops/legal/docs",             icon: "FileText" },
          { label: "Attorney Reports", path: "/ops/legal/attorney-reports", icon: "Newspaper" },
        ],
      },

      {
        // RENAMED: Work Orders → Maintenance
        label: "Maintenance",
        icon: "Wrench",
        path: "/ops/work",
        children: [
          { label: "Work Orders",          path: "/ops/work/work-orders",         icon: "ClipboardCheck" },
          { label: "Vendors",              path: "/ops/work/vendors",             icon: "Truck" },
          // MOVED from Growth
          { label: "Inventory",            path: "/ops/work/inventory",           icon: "PackageSearch" },
          { label: "Materials & Inventory",path: "/ops/work/materials-inventory", icon: "Boxes" },
          { label: "Smart Routing",        path: "/ops/work/smart-routing",       icon: "Route" },
          { label: "AI Intelligence",      path: "/ops/work/ai-intelligence",     icon: "Sparkles" }, // see notes below
          { label: "Build/Repair Projects",path: "/ops/work/build-repair-projects", icon: "HardHat" },
          { label: "Capital Projects",     path: "/ops/work/capital-projects",    icon: "Factory" },
        ],
      },

      { label: "Reports", path: "/ops/reports", icon: "BarChart3" },
    ],
  },

  {
    label: "Growth",
    items: [
      // Inventory was moved under Maintenance.
      { label: "Marketing",    path: "/growth/marketing",    icon: "Megaphone" },
      // Optional: an acquisitions view to track pipeline
      { label: "Acquisitions", path: "/growth/acquisitions", icon: "Building" },
    ],
  },

  {
    label: "System",
    items: [
      { label: "Automation", path: "/system/automation", icon: "Bot" },
      { label: "Settings",   path: "/system/settings",   icon: "Settings" },
    ],
  },

  {
    label: "Data Management",
    items: [
      {
        label: "Data Management",
        icon: "Database",
        path: "/data",
        children: [
          { label: "Sync Audit",       path: "/data/sync-audit",        icon: "ClipboardList" },
          { label: "Sync Management",  path: "/data/sync-management",   icon: "ServerCog" },
          { label: "Raw Data",         path: "/data/raw",               icon: "Table2" },
          { label: "Sync Logs",        path: "/data/sync-logs",         icon: "Scroll" },
          { label: "System Settings",  path: "/data/system-settings",   icon: "SlidersHorizontal" },
        ],
      },
    ],
  },

  {
    label: "Investor Portal",
    items: [
      {
        label: "Investor Portal",
        icon: "Briefcase",
        path: "/investor",
        children: [
          { label: "Dashboard",          path: "/investor/dashboard",          icon: "LayoutDashboard" },
          { label: "Portfolio Analytics",path: "/investor/portfolio-analytics",icon: "LineChart" },
          { label: "Financial Reports",  path: "/investor/financial-reports",  icon: "ReceiptText" },
        ],
      },
    ],
  },

  {
    label: "Integrations",
    items: [
      {
        label: "Integrations",
        icon: "PlugZap",
        path: "/integrations",
        children: [
          { label: "Dropbox Files",       path: "/integrations/dropbox",    icon: "FolderCloud" },
          { label: "CoreLogic / MLS Grid",path: "/integrations/corelogic",  icon: "Grid3x3" },
          { label: "Field App Link",      path: "/integrations/field-app",  icon: "Link" },
          { label: "Deal Room Link",      path: "/integrations/deal-room",  icon: "Handshake" },
        ],
      },
    ],
  },
];

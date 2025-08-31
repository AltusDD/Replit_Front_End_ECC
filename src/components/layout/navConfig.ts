// src/components/layout/navConfig.ts
export type NavItem = {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

// Canonical Navigation
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Primary",
    items: [{ label: "Dashboard", path: "/dashboard", icon: "Home" }],
  },
  {
    label: "Portfolio V3",
    items: [
      {
        label: "Portfolio V3",
        icon: "LayoutGrid",
        children: [
          { label: "Properties", path: "/portfolio/properties", icon: "Building2" },
          { label: "Units", path: "/portfolio/units", icon: "House" },
          { label: "Leases", path: "/portfolio/leases", icon: "ScrollText" },
          { label: "Tenants", path: "/portfolio/tenants", icon: "Users" },
          { label: "Owners", path: "/portfolio/owners", icon: "UserSquare2" }
        ],
      }
    ],
  },
  {
    label: "Cards (Entity Hubs)",
    items: [
      {
        label: "Cards",
        icon: "Layers",
        children: [
          { label: "Property Card", path: "/card/property/:id", icon: "Building" },
          { label: "Unit Card", path: "/card/unit/:id", icon: "Home" },
          { label: "Lease Card", path: "/card/lease/:id", icon: "FileText" },
          { label: "Tenant Card", path: "/card/tenant/:id", icon: "UserRound" },
          { label: "Owner Card", path: "/card/owner/:id", icon: "User" }
        ],
      }
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Accounting",
        icon: "Banknote",
        children: [
          { label: "Overview", path: "/ops/accounting/overview", icon: "LayoutDashboard" },
          { label: "Rent Collection", path: "/ops/accounting/rent-collection", icon: "HandCoins" },
          { label: "Expenses", path: "/ops/accounting/expenses", icon: "CreditCard" },
          { label: "Financial Reports", path: "/ops/accounting/financial-reports", icon: "BarChart2" },
          { label: "Tenant Ledgers", path: "/ops/accounting/tenant-ledgers", icon: "FileSpreadsheet" },
          { label: "Collections Dashboard", path: "/ops/accounting/collections-dashboard", icon: "Gauge" },
          { label: "Collections Log", path: "/ops/accounting/collections-log", icon: "ListChecks" },
          { label: "Payment Plans", path: "/ops/accounting/payment-plans", icon: "CalendarClock" },
          { label: "Deposits", path: "/ops/accounting/deposits", icon: "Wallet" },
          { label: "Transfers", path: "/ops/accounting/transfers", icon: "ArrowLeftRight" },
          { label: "Subsidized Housing", path: "/ops/accounting/subsidized-housing", icon: "BadgeDollarSign" },
          { label: "Assistance Programs", path: "/ops/accounting/assistance-programs", icon: "Handshake" }
        ],
      },
      {
        label: "AI Analytics",
        icon: "Sparkles",
        children: [
          { label: "Risk Summary", path: "/ops/ai/risk-summary", icon: "ShieldAlert" },
          { label: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting", icon: "LineChart" },
          { label: "Vacancy Analytics", path: "/ops/ai/vacancy-analytics", icon: "PieChart" },
          { label: "ML Leasing Logs", path: "/ops/ai/ml-leasing-logs", icon: "ScrollText" }
        ],
      },
      {
        label: "Legal Tracker",
        icon: "Scale",
        children: [
          { label: "Case Manager", path: "/ops/legal/case-manager", icon: "Gavel" },
          { label: "Advanced Legal Ops", path: "/ops/legal/advanced", icon: "Lightbulb" },
          { label: "Legal Docs", path: "/ops/legal/docs", icon: "Files" },
          { label: "Attorney Reports", path: "/ops/legal/attorney-reports", icon: "ClipboardList" }
        ],
      },
      {
        label: "Communication",
        icon: "MessageSquare",
        children: [
          { label: "Queue", path: "/ops/comms/queue", icon: "Inbox" },
          { label: "Templates", path: "/ops/comms/templates", icon: "FileCode2" },
          { label: "Logs", path: "/ops/comms/logs", icon: "History" }
        ],
      },
      {
        label: "Work Orders",
        icon: "Wrench",
        children: [
          { label: "Work Orders", path: "/ops/work/work-orders", icon: "Wrench" },
          { label: "Vendors", path: "/ops/work/vendors", icon: "Truck" },
          { label: "Materials & Inventory", path: "/ops/work/materials-inventory", icon: "Boxes" },
          { label: "Smart Routing", path: "/ops/work/smart-routing", icon: "GitBranch" },
          { label: "AI Intelligence", path: "/ops/work/ai-intelligence", icon: "Bot" },
          { label: "Build/Repair Projects", path: "/ops/work/build-repair-projects", icon: "Hammer" },
          { label: "Capital Projects", path: "/ops/work/capital-projects", icon: "Building2" }
        ],
      },
      { label: "Reports", path: "/ops/reports", icon: "FileBarChart" }
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Inventory", path: "/growth/inventory", icon: "PackageSearch" },
      { label: "Marketing", path: "/growth/marketing", icon: "Megaphone" }
    ],
  },
  {
    label: "System",
    items: [
      { label: "Automation", path: "/system/automation", icon: "Workflow" },
      { label: "Settings", path: "/system/settings", icon: "Settings" }
    ],
  },
  {
    label: "Data Management",
    items: [
      {
        label: "Data Management",
        icon: "Database",
        children: [
          { label: "Sync Audit", path: "/data/sync-audit", icon: "Binary" },
          { label: "Sync Management", path: "/data/sync-management", icon: "RefreshCcw" },
          { label: "Raw Data", path: "/data/raw", icon: "Brackets" },
          { label: "Sync Logs", path: "/data/sync-logs", icon: "List" },
          { label: "System Settings", path: "/data/system-settings", icon: "SlidersHorizontal" }
        ],
      }
    ],
  },
  {
    label: "Investor Portal",
    items: [
      {
        label: "Investor Portal",
        icon: "Briefcase",
        children: [
          { label: "Dashboard", path: "/investor/dashboard", icon: "Gauge" },
          { label: "Portfolio Analytics", path: "/investor/portfolio-analytics", icon: "ChartSpline" },
          { label: "Financial Reports", path: "/investor/financial-reports", icon: "FileBarChart" }
        ],
      }
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        label: "Integrations",
        icon: "PlugZap",
        children: [
          { label: "Dropbox Files", path: "/integrations/dropbox", icon: "Dropbox" },
          { label: "CoreLogic / MLS Grid", path: "/integrations/corelogic", icon: "Grid2X2" },
          { label: "Field App Link", path: "/integrations/field-app", icon: "Smartphone" },
          { label: "Deal Room Link", path: "/integrations/deal-room", icon: "Handshake" }
        ],
      }
    ],
  },
];

export type NavItem = {
  label: string;
  to: string;
  icon: string;
};

export type NavGroup = {
  label: string;
  icon: string;
  items: NavItem[];
};

export type NavSection = {
  title: string;
  items: (NavItem | NavGroup)[];
};

const navigationConfig: NavSection[] = [
  {
    title: "Primary",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" }
    ]
  },
  {
    title: "Portfolio V3", 
    items: [
      { label: "Properties", to: "/portfolio/properties", icon: "Building" },
      { label: "Units", to: "/portfolio/units", icon: "Layers" },
      { label: "Leases", to: "/portfolio/leases", icon: "FileText" },
      { label: "Tenants", to: "/portfolio/tenants", icon: "Users" },
      { label: "Owners", to: "/portfolio/owners", icon: "UserCheck" }
    ]
  },
  {
    title: "Cards",
    items: [
      { label: "Property Card", to: "/card/property", icon: "MapPin" },
      { label: "Unit Card", to: "/card/unit", icon: "Square" },
      { label: "Lease Card", to: "/card/lease", icon: "FileText" },
      { label: "Tenant Card", to: "/card/tenant", icon: "User" },
      { label: "Owner Card", to: "/card/owner", icon: "Crown" }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        label: "Accounting",
        icon: "Calculator",
        items: [
          { label: "Overview", to: "/ops/accounting/overview", icon: "BarChart3" },
          { label: "Rent Collection", to: "/ops/accounting/rent-collection", icon: "DollarSign" },
          { label: "Expenses", to: "/ops/accounting/expenses", icon: "Receipt" },
          { label: "Financial Reports", to: "/ops/accounting/financial-reports", icon: "TrendingUp" },
          { label: "Tenant Ledgers", to: "/ops/accounting/tenant-ledgers", icon: "BookOpen" },
          { label: "Collections Dashboard", to: "/ops/accounting/collections-dashboard", icon: "Target" },
          { label: "Collections Log", to: "/ops/accounting/collections-log", icon: "ScrollText" },
          { label: "Payment Plans", to: "/ops/accounting/payment-plans", icon: "Calendar" },
          { label: "Deposits", to: "/ops/accounting/deposits", icon: "Piggybank" },
          { label: "Transfers", to: "/ops/accounting/transfers", icon: "ArrowLeftRight" },
          { label: "Subsidized Housing", to: "/ops/accounting/subsidized-housing", icon: "Home" },
          { label: "Assistance Programs", to: "/ops/accounting/assistance-programs", icon: "HandHeart" }
        ]
      },
      {
        label: "AI Analytics",
        icon: "Brain",
        items: [
          { label: "Risk Summary", to: "/ops/ai/risk-summary", icon: "AlertTriangle" },
          { label: "Renewal Forecasting", to: "/ops/ai/renewal-forecasting", icon: "TrendingUp" },
          { label: "Vacancy Analytics", to: "/ops/ai/vacancy-analytics", icon: "DoorOpen" },
          { label: "ML Leasing Logs", to: "/ops/ai/ml-leasing-logs", icon: "Bot" }
        ]
      },
      {
        label: "Legal Tracker",
        icon: "Scale",
        items: [
          { label: "Case Manager", to: "/ops/legal/case-manager", icon: "Briefcase" },
          { label: "Advanced Legal Ops", to: "/ops/legal/advanced", icon: "Gavel" },
          { label: "Legal Docs", to: "/ops/legal/docs", icon: "FileText" },
          { label: "Attorney Reports", to: "/ops/legal/attorney-reports", icon: "Users" }
        ]
      },
      {
        label: "Communication",
        icon: "MessageSquare",
        items: [
          { label: "Queue", to: "/ops/comms/queue", icon: "Clock" },
          { label: "Templates", to: "/ops/comms/templates", icon: "Layout" },
          { label: "Logs", to: "/ops/comms/logs", icon: "ScrollText" }
        ]
      },
      {
        label: "Work Orders",
        icon: "Wrench",
        items: [
          { label: "Work Orders", to: "/ops/work/work-orders", icon: "ClipboardList" },
          { label: "Vendors", to: "/ops/work/vendors", icon: "Truck" },
          { label: "Materials & Inventory", to: "/ops/work/materials-inventory", icon: "Package" },
          { label: "Smart Routing", to: "/ops/work/smart-routing", icon: "Route" },
          { label: "AI Intelligence", to: "/ops/work/ai-intelligence", icon: "Zap" },
          { label: "Build/Repair Projects", to: "/ops/work/build-repair-projects", icon: "Hammer" },
          { label: "Capital Projects", to: "/ops/work/capital-projects", icon: "Building2" }
        ]
      },
      { label: "Reports", to: "/ops/reports", icon: "FileBarChart" }
    ]
  },
  {
    title: "Growth",
    items: [
      { label: "Inventory", to: "/growth/inventory", icon: "Package2" },
      { label: "Marketing", to: "/growth/marketing", icon: "Megaphone" }
    ]
  },
  {
    title: "System",
    items: [
      { label: "Automation", to: "/system/automation", icon: "Zap" },
      { label: "Settings", to: "/system/settings", icon: "Settings" }
    ]
  },
  {
    title: "Data Management",
    items: [
      { label: "Sync Audit", to: "/data/sync-audit", icon: "Shield" },
      { label: "Sync Management", to: "/data/sync-management", icon: "RefreshCw" },
      { label: "Raw Data", to: "/data/raw", icon: "Database" },
      { label: "Sync Logs", to: "/data/sync-logs", icon: "ScrollText" },
      { label: "System Settings", to: "/data/system-settings", icon: "Cog" }
    ]
  },
  {
    title: "Investor Portal",
    items: [
      { label: "Dashboard", to: "/investor/dashboard", icon: "PieChart" },
      { label: "Portfolio Analytics", to: "/investor/portfolio-analytics", icon: "TrendingUp" },
      { label: "Financial Reports", to: "/investor/financial-reports", icon: "FileBarChart" }
    ]
  },
  {
    title: "Integrations",
    items: [
      { label: "Dropbox Files", to: "/integrations/dropbox", icon: "FolderOpen" },
      { label: "CoreLogic / MLS Grid", to: "/integrations/corelogic", icon: "Grid3x3" },
      { label: "Field App Link", to: "/integrations/field-app", icon: "Smartphone" },
      { label: "Deal Room Link", to: "/integrations/deal-room", icon: "Handshake" }
    ]
  }
];

export default navigationConfig;
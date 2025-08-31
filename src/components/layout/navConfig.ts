
// src/components/layout/navConfig.ts
// Canonical nav + icon names (Lucide); parents gold, children alt-blue (styled in CSS)

export type Leaf = { label: string; to: string; icon: string };
export type Group = { label: string; icon: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

const sections: Section[] = [
  {
    title: "Primary",
    items: [{ label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" }],
  },

  {
    title: "Portfolio V3",
    items: [
      { label: "Properties", to: "/portfolio/properties", icon: "Building2" },
      { label: "Units", to: "/portfolio/units", icon: "Layers" },
      { label: "Leases", to: "/portfolio/leases", icon: "FileText" },
      { label: "Tenants", to: "/portfolio/tenants", icon: "Users2" },
      { label: "Owners", to: "/portfolio/owners", icon: "UserCheck" },
    ],
  },

  {
    title: "Cards (Entity Hubs)",
    items: [
      { label: "Property Card", to: "/card/property/:id", icon: "Home" },
      { label: "Unit Card", to: "/card/unit/:id", icon: "SquareStack" },
      { label: "Lease Card", to: "/card/lease/:id", icon: "FileBadge2" },
      { label: "Tenant Card", to: "/card/tenant/:id", icon: "UserRound" },
      { label: "Owner Card", to: "/card/owner/:id", icon: "Crown" },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        label: "Accounting",
        icon: "Wallet",
        children: [
          { label: "Overview", to: "/ops/accounting/overview", icon: "ChartPie" },
          { label: "Rent Collection", to: "/ops/accounting/rent-collection", icon: "Coins" },
          { label: "Expenses", to: "/ops/accounting/expenses", icon: "ReceiptText" },
          { label: "Financial Reports", to: "/ops/accounting/financial-reports", icon: "Receipt" },
          { label: "Tenant Ledgers", to: "/ops/accounting/tenant-ledgers", icon: "BookOpenText" },
          { label: "Collections Dashboard", to: "/ops/accounting/collections-dashboard", icon: "BarChart3" },
          { label: "Collections Log", to: "/ops/accounting/collections-log", icon: "NotepadText" },
          { label: "Payment Plans", to: "/ops/accounting/payment-plans", icon: "CalendarCheck2" },
          { label: "Deposits", to: "/ops/accounting/deposits", icon: "Banknote" },
          { label: "Transfers", to: "/ops/accounting/transfers", icon: "ArrowLeftRight" },
          { label: "Subsidized Housing", to: "/ops/accounting/subsidized-housing", icon: "Building" },
          { label: "Assistance Programs", to: "/ops/accounting/assistance-programs", icon: "HelpingHand" },
        ],
      },
      {
        label: "AI Analytics",
        icon: "Brain",
        children: [
          { label: "Risk Summary", to: "/ops/ai/risk-summary", icon: "ShieldAlert" },
          { label: "Renewal Forecasting", to: "/ops/ai/renewal-forecasting", icon: "TrendingUp" },
          { label: "Vacancy Analytics", to: "/ops/ai/vacancy-analytics", icon: "ChartLine" },
          { label: "ML Leasing Logs", to: "/ops/ai/ml-leasing-logs", icon: "ListTree" },
        ],
      },
      {
        label: "Legal Tracker",
        icon: "Scale",
        children: [
          { label: "Case Manager", to: "/ops/legal/case-manager", icon: "CaseSensitive" },
          { label: "Advanced Legal Ops", to: "/ops/legal/advanced", icon: "Gavel" },
          { label: "Legal Docs", to: "/ops/legal/docs", icon: "FileArchive" },
          { label: "Attorney Reports", to: "/ops/legal/attorney-reports", icon: "FileSearch" },
        ],
      },
      {
        label: "Communication",
        icon: "MessageSquare",
        children: [
          { label: "Queue", to: "/ops/comms/queue", icon: "Inbox" },
          { label: "Templates", to: "/ops/comms/templates", icon: "FileCode2" },
          { label: "Logs", to: "/ops/comms/logs", icon: "ClipboardList" },
        ],
      },
      {
        label: "Work Orders",
        icon: "Wrench",
        children: [
          { label: "Work Orders", to: "/ops/work/work-orders", icon: "ClipboardCheck" },
          { label: "Vendors", to: "/ops/work/vendors", icon: "Handshake" },
          { label: "Materials & Inventory", to: "/ops/work/materials-inventory", icon: "Boxes" },
          { label: "Smart Routing", to: "/ops/work/smart-routing", icon: "Workflow" },
          { label: "AI Intelligence", to: "/ops/work/ai-intelligence", icon: "Sparkles" },
          { label: "Build/Repair Projects", to: "/ops/work/build-repair-projects", icon: "Hammer" },
          { label: "Capital Projects", to: "/ops/work/capital-projects", icon: "Factory" },
        ],
      },
      { label: "Reports", to: "/ops/reports", icon: "FileBarChart2" },
    ],
  },

  {
    title: "Growth",
    items: [
      { label: "Inventory", to: "/growth/inventory", icon: "Boxes" },
      { label: "Marketing", to: "/growth/marketing", icon: "Megaphone" },
    ],
  },

  {
    title: "System",
    items: [
      { label: "Automation", to: "/system/automation", icon: "Workflow" },
      { label: "Settings", to: "/system/settings", icon: "Settings" },
    ],
  },

  {
    title: "Data Management",
    items: [
      { label: "Sync Audit", to: "/data/sync-audit", icon: "ClipboardList" },
      { label: "Sync Management", to: "/data/sync-management", icon: "Network" },
      { label: "Raw Data", to: "/data/raw", icon: "Database" },
      { label: "Sync Logs", to: "/data/sync-logs", icon: "FileClock" },
      { label: "System Settings", to: "/data/system-settings", icon: "Settings2" },
    ],
  },

  {
    title: "Investor Portal",
    items: [
      { label: "Dashboard", to: "/investor/dashboard", icon: "Gauge" },
      { label: "Portfolio Analytics", to: "/investor/portfolio-analytics", icon: "LineChart" },
      { label: "Financial Reports", to: "/investor/financial-reports", icon: "FileSpreadsheet" },
    ],
  },

  {
    title: "Integrations",
    items: [
      { label: "Dropbox Files", to: "/integrations/dropbox", icon: "FolderKanban" },
      { label: "CoreLogic / MLS Grid", to: "/integrations/corelogic", icon: "Globe" },
      { label: "Field App Link", to: "/integrations/field-app", icon: "Smartphone" },
      { label: "Deal Room Link", to: "/integrations/deal-room", icon: "Handshake" },
    ],
  },
];

export { sections };
export default sections;

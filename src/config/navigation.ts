// Canonical, data-driven nav used by Sidebar
// Uses lucide-react icon names
export type IconName =
  | "LayoutDashboard" | "Boxes" | "Shield" | "Hammer" | "BarChart3"
  | "LineChart" | "PieChart" | "Database" | "Cog" | "Link" | "FileText"
  | "FolderOpen" | "ClipboardList" | "BookOpen" | "Settings"
  | "Scale" | "MessageSquare" | "Link2"
  | "Home" | "Users" | "IdCard" | "NotebookText" | "Wallet" | "Receipt"
  | "ScrollText" | "CalendarRange" | "Banknote" | "ArrowLeftRight"
  | "Building2" | "Handshake" | "ShieldCheck" | "CalendarClock" | "Bot"
  | "Gavel" | "Archive" | "Briefcase" | "Inbox" | "FileCode2" | "ListChecks"
  | "Wrench" | "Factory" | "PackageSearch" | "Route" | "Cpu" | "Building"
  | "Megaphone" | "Workflow" | "ShieldAlert" | "ServerCog" | "Sliders"
  | "Box" | "SquareCode" | "ExternalLink"
  // Additional icons for topic-specific child links
  | "Grid3x3" | "FileSignature" | "CreditCard" | "FileBarChart" | "BookText"
  | "Presentation" | "PiggyBank" | "HelpingHand" | "RefreshCw" | "TrendingUp"
  | "FileType" | "Truck" | "Brain" | "LandPlot" | "PlusSquare" | "Save"
  | "History" | "Repeat" | "Cloud" | "Grid" | "Smartphone";

export type NavChild = {
  label: string;
  path: string;
  testid?: string;
  icon?: IconName;
  badgeKey?: string;
};

export type NavParent = {
  label: string;
  icon: IconName;
  children: NavChild[];
  testid?: string;
  meta?: { section: string };
};

export const NAV_SECTIONS: NavParent[] = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    testid: "nav-dashboard",
    meta: { section: "Dashboard" },
    children: [],
  },
  {
    label: "Portfolio",
    icon: "Boxes",
    testid: "nav-portfolio",
    meta: { section: "Portfolio" },
children: [
  { label: "Properties", path: "/portfolio/properties", icon: "Building",       testid: "nav-portfolio-properties" },
  { label: "Units",      path: "/portfolio/units",      icon: "Grid3x3",      testid: "nav-portfolio-units" },
  { label: "Leases",     path: "/portfolio/leases",     icon: "FileSignature", testid: "nav-portfolio-leases" },
  { label: "Tenants",    path: "/portfolio/tenants",    icon: "Users",        testid: "nav-portfolio-tenants" },
  { label: "Owners",     path: "/portfolio/owners",     icon: "IdCard",       testid: "nav-portfolio-owners" },
]
  },
  {
    label: "Accounting",
    icon: "FileText",
    testid: "nav-accounting",
    meta: { section: "Operations" },
children: [
  { label: "Overview",             path: "/ops/accounting/overview",              icon: "LayoutDashboard", testid: "nav-accounting-overview" },
  { label: "Rent Collection",      path: "/ops/accounting/rent-collection",       icon: "CreditCard",     testid: "nav-accounting-rent" },
  { label: "Expenses",             path: "/ops/accounting/expenses",              icon: "Receipt",        testid: "nav-accounting-expenses" },
  { label: "Financial Reports",    path: "/ops/accounting/financial-reports",     icon: "FileBarChart",   testid: "nav-accounting-financial-reports" },
  { label: "Tenant Ledgers",       path: "/ops/accounting/tenant-ledgers",        icon: "BookText",       testid: "nav-accounting-ledgers" },
  { label: "Collections Dashboard",path: "/ops/accounting/collections-dashboard", icon: "Presentation",   testid: "nav-accounting-collections-dash" },
  { label: "Collections Log",      path: "/ops/accounting/collections-log",       icon: "ClipboardList",  testid: "nav-accounting-collections-log" },
  { label: "Payment Plans",        path: "/ops/accounting/payment-plans",         icon: "CalendarClock",  testid: "nav-accounting-payment-plans" },
  { label: "Deposits",             path: "/ops/accounting/deposits",              icon: "PiggyBank",      testid: "nav-accounting-deposits" },
  { label: "Transfers",            path: "/ops/accounting/transfers",             icon: "ArrowLeftRight", testid: "nav-accounting-transfers" },
  { label: "Subsidized Housing",   path: "/ops/accounting/subsidized-housing",    icon: "Home",           testid: "nav-accounting-subsidized" },
  { label: "Assistance Programs",  path: "/ops/accounting/assistance-programs",   icon: "HelpingHand",    testid: "nav-accounting-assistance" },
]
  },
  {
    label: "AI Analytics",
    icon: "Shield",
    testid: "nav-ai-analytics",
    meta: { section: "Operations" },
children: [
  { label: "Risk Summary",        path: "/ops/ai/risk-summary",        icon: "ShieldAlert",  testid: "nav-ai-risk" },
  { label: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting", icon: "RefreshCw",    testid: "nav-ai-renewal" },
  { label: "Vacancy Analytics",   path: "/ops/ai/vacancy-analytics",   icon: "TrendingUp",   testid: "nav-ai-vacancy" },
  { label: "ML Leasing Logs",     path: "/ops/ai/ml-leasing-logs",     icon: "Cpu",          testid: "nav-ai-ml-leasing" },
],
  },
  {
    label: "Legal Tracker",
    icon: "Scale",
    testid: "nav-legal-tracker",
    meta: { section: "Operations" },
children: [
  { label: "Case Manager",        path: "/ops/legal/case-manager",    icon: "Gavel",     testid: "nav-legal-cases" },
  { label: "Advanced Legal Ops",  path: "/ops/legal/advanced",        icon: "Scale",     testid: "nav-legal-advanced" },
  { label: "Legal Docs",          path: "/ops/legal/docs",            icon: "FileText",  testid: "nav-legal-docs" },
  { label: "Attorney Reports",    path: "/ops/legal/attorney-reports",icon: "BarChart3", testid: "nav-legal-attorney-reports" },
],
  },
  {
    label: "Communication",
    icon: "MessageSquare",
    testid: "nav-communication",
    meta: { section: "Operations" },
children: [
  { label: "Queue",     path: "/ops/comms/queue",     icon: "MessageSquare", testid: "nav-comm-queue" },
  { label: "Templates", path: "/ops/comms/templates", icon: "FileType",     testid: "nav-comm-templates" },
  { label: "Logs",      path: "/ops/comms/logs",      icon: "ScrollText",   testid: "nav-comm-logs" },
],
  },
  {
    label: "Construction & Repair",
    icon: "Hammer",
    testid: "nav-construction-repair",
    meta: { section: "Operations" },
children: [
  { label: "Work Orders",           path: "/ops/maintenance/work-orders",           icon: "Wrench",     testid: "nav-mx-workorders" },
  { label: "Vendors",               path: "/ops/maintenance/vendors",               icon: "Truck",      testid: "nav-mx-vendors" },
  { label: "Materials & Inventory", path: "/ops/maintenance/materials-inventory",  icon: "Boxes",      testid: "nav-mx-materials" },
  { label: "Smart Routing",         path: "/ops/maintenance/smart-routing",        icon: "Route",      testid: "nav-mx-routing" },
  { label: "AI Intelligence",       path: "/ops/maintenance/ai-intelligence",      icon: "Brain",      testid: "nav-mx-ai" },
  { label: "Build/Repair Projects", path: "/ops/maintenance/build-repair-projects",icon: "Hammer",     testid: "nav-mx-projects" },
  { label: "Capital Projects",      path: "/ops/maintenance/capital-projects",     icon: "LandPlot",   testid: "nav-mx-capital" },
],
  },
  {
    label: "Reports",
    icon: "BarChart3",
    testid: "nav-reports",
    meta: { section: "System" },
children: [
  { label: "Reports Home",  path: "/reports",         icon: "Home",       testid: "nav-reports-home" },
  { label: "Create Report", path: "/reports/create",  icon: "PlusSquare", testid: "nav-reports-create" },
  { label: "Saved Reports", path: "/reports/saved",   icon: "Save",       testid: "nav-reports-saved" },
]
  },
  {
    label: "Growth",
    icon: "PieChart",
    testid: "nav-growth",
    meta: { section: "Growth" },
children: [
  { label: "Growth",    path: "/growth",           icon: "PieChart",  testid: "nav-growth-growth" },
  { label: "Marketing", path: "/growth/marketing", icon: "Megaphone", testid: "nav-growth-marketing" },
]
  },
  {
    label: "System",
    icon: "Settings",
    testid: "nav-system",
    meta: { section: "System" },
children: [
  { label: "Automation", path: "/system/automation", icon: "Bot",      testid: "nav-system-automation" },
  { label: "Settings",   path: "/system/settings",   icon: "Settings", testid: "nav-system-settings" },
],
  },
  {
    label: "Data Management",
    icon: "Database",
    testid: "nav-data-management",
    meta: { section: "Data Management" },
children: [
  { label: "Sync Audit",      path: "/data/sync-audit",      icon: "History",   testid: "nav-data-sync-audit" },
  { label: "Sync Management", path: "/data/sync-management", icon: "Repeat",    testid: "nav-data-sync-mgmt" },
  { label: "Raw Data",        path: "/data/raw",             icon: "Database",  testid: "nav-data-raw" },
  { label: "Sync Logs",       path: "/data/sync-logs",       icon: "ListChecks",testid: "nav-data-sync-logs" },
  { label: "System Settings", path: "/data/system-settings", icon: "Sliders",   testid: "nav-data-system-settings" },
],
  },
  {
    label: "Investor Portal",
    icon: "PieChart",
    testid: "nav-investor-portal",
    meta: { section: "Investor Portal" },
children: [
  { label: "Dashboard",           path: "/investor/dashboard",           icon: "LayoutDashboard", testid: "nav-investor-dash" },
  { label: "Portfolio Analytics", path: "/investor/portfolio-analytics", icon: "PieChart",       testid: "nav-investor-analytics" },
  { label: "Financial Reports",   path: "/investor/financial-reports",   icon: "FileBarChart",    testid: "nav-investor-reports" },
],
  },
  {
    label: "Integrations",
    icon: "Link2",
    testid: "nav-integrations",
    meta: { section: "Integrations" },
children: [
  { label: "Dropbox Files",        path: "/integrations/dropbox",        icon: "Cloud",       testid: "nav-integ-dropbox" },
  { label: "CoreLogic / MLS Grid", path: "/integrations/corelogic",      icon: "Grid",        testid: "nav-integ-corelogic" },
  { label: "Field App Link",       path: "/integrations/field-app",      icon: "Smartphone",  testid: "nav-integ-fieldapp" },
  { label: "Deal Room Link",       path: "/integrations/deal-room",      icon: "Briefcase",   testid: "nav-integ-dealroom" },
]
  },
];

export const NAV_ORDER = [
  "Dashboard",
  "Portfolio",
  "Accounting",
  "AI Analytics",
  "Legal Tracker",
  "Communication",
  "Construction & Repair",
  "Reports",
  "Growth",
  "System",
  "Data Management",
  "Investor Portal",
  "Integrations"
] as const;

export function orderedNav(sections: NavParent[]): NavParent[] {
  const map = new Map(sections.map(s => [s.label, s]));
  return NAV_ORDER.map(lbl => map.get(lbl)!).filter(Boolean);
}

export function getIconForSection(sectionLabel: string): IconName {
  const section = NAV_SECTIONS.find(s => s.label === sectionLabel);
  return section?.icon || "Settings"; // fallback to Settings icon
}

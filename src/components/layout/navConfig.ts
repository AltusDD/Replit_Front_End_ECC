export type Leaf = { label: string; path: string };
export type Group = { label: string; items: Leaf[] };
export type Section = { label: string; groups: Group[] };

/** Canonical NAV (expanded) */
const NAV: Section[] = [
  // Dashboard
  { label: "Dashboard", groups: [
    { label: "Dashboard", items: [
      { label: "Home", path: "/dashboard" },
    ]},
  ]},

  // Portfolio V3
  { label: "Portfolio V3", groups: [
    { label: "Portfolio", items: [
      { label: "Properties", path: "/portfolio/properties" },
      { label: "Units",      path: "/portfolio/units" },
      { label: "Leases",     path: "/portfolio/leases" },
      { label: "Tenants",    path: "/portfolio/tenants" },
      { label: "Owners",     path: "/portfolio/owners" },
    ]},
  ]},

  // Cards
  { label: "Cards", groups: [
    { label: "Cards", items: [
      { label: "Overview",      path: "/wip/cards/overview" },
      { label: "Delinquencies", path: "/wip/cards/delinquencies" },
      { label: "Vacancy",       path: "/wip/cards/vacancy" },
      { label: "Turnover",      path: "/wip/cards/turnover" },
      { label: "Work Orders",   path: "/wip/cards/work-orders" },
      { label: "Revenue",       path: "/wip/cards/revenue" },
      { label: "Expenses",      path: "/wip/cards/expenses" },
    ]},
  ]},

  // Operations
  { label: "Operations", groups: [
    { label: "Accounting", items: [
      { label: "AR",       path: "/wip/operations/accounting/ar" },
      { label: "AP",       path: "/wip/operations/accounting/ap" },
      { label: "Banking",  path: "/wip/operations/accounting/banking" },
      { label: "Reports",  path: "/wip/operations/accounting/reports" },
    ]},
    { label: "Leasing", items: [
      { label: "Applications", path: "/wip/operations/leasing/apps" },
      { label: "Renewals",     path: "/wip/operations/leasing/renewals" },
      { label: "Move-ins",     path: "/wip/operations/leasing/moveins" },
      { label: "Move-outs",    path: "/wip/operations/leasing/moveouts" },
    ]},
    { label: "Maintenance", items: [
      { label: "Work Orders", path: "/wip/operations/maintenance/work-orders" },
      { label: "Vendors",     path: "/wip/operations/maintenance/vendors" },
      { label: "Schedules",   path: "/wip/operations/maintenance/schedules" },
    ]},
    { label: "Marketing", items: [
      { label: "Listings",  path: "/wip/operations/marketing/listings" },
      { label: "Leads",     path: "/wip/operations/marketing/leads" },
      { label: "Campaigns", path: "/wip/operations/marketing/campaigns" },
    ]},
  ]},

  // AI Intelligence
  { label: "AI Intelligence", groups: [
    { label: "AI", items: [
      { label: "Insights",         path: "/wip/ai/insights" },
      { label: "Anomalies",        path: "/wip/ai/anomalies" },
      { label: "Recommendations",  path: "/wip/ai/recommendations" },
      { label: "Forecasts",        path: "/wip/ai/forecasts" },
    ]},
  ]},

  // Work Management
  { label: "Work Management", groups: [
    { label: "Work", items: [
      { label: "Tasks",    path: "/wip/work/tasks" },
      { label: "Projects", path: "/wip/work/projects" },
      { label: "Sprints",  path: "/wip/work/sprints" },
      { label: "Backlog",  path: "/wip/work/backlog" },
    ]},
  ]},

  // Legal
  { label: "Legal", groups: [
    { label: "Legal", items: [
      { label: "Documents",  path: "/wip/legal/documents" },
      { label: "Notices",    path: "/wip/legal/notices" },
      { label: "Evictions",  path: "/wip/legal/evictions" },
      { label: "Compliance", path: "/wip/legal/compliance" },
    ]},
  ]},

  // Tools
  { label: "Tools", groups: [
    { label: "Tools", items: [
      { label: "Probe", path: "/tools/probe" },
    ]},
  ]},
];

export default NAV;

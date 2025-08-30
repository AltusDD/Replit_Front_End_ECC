export type Leaf = { label: string; path: string };
export type Group = { label: string; items: Leaf[] };
export type Section = { label: string; groups: Group[] };

export const NAV: Section[] = [
  { label: "Dashboard", groups: [{ label: "Dashboard", items: [{ label: "Home", path: "/dashboard" }] }] },

  { label: "Portfolio", groups: [{ label: "Portfolio", items: [
    { label: "Properties", path: "/portfolio/properties" },
    { label: "Units", path: "/portfolio/units" },
    { label: "Leases", path: "/portfolio/leases" },
    { label: "Tenants", path: "/portfolio/tenants" },
    { label: "Owners", path: "/portfolio/owners" }
  ] }] },

  { label: "Cards", groups: [{ label: "Cards", items: [
    { label: "Inbox", path: "/cards/inbox" },
    { label: "Tasks", path: "/cards/tasks" },
    { label: "Opportunities", path: "/cards/opportunities" },
    { label: "Anomalies", path: "/cards/anomalies" },
    { label: "Next Best Action", path: "/cards/next-best-action" }
  ] }] },

  { label: "Operations", groups: [
    { label: "Accounting", items: [
      { label: "Overview", path: "/ops/accounting/overview" },
      { label: "Collections Dashboard", path: "/ops/accounting/collections-dashboard" },
      { label: "Rent Collection", path: "/ops/accounting/rent-collection" },
      { label: "Tenant Ledgers", path: "/ops/accounting/tenant-ledgers" },
      { label: "Financial Reports", path: "/ops/accounting/financial-reports" },
      { label: "Deposits", path: "/ops/accounting/deposits" },
      { label: "Expenses", path: "/ops/accounting/expenses" },
      { label: "Payment Plans", path: "/ops/accounting/payment-plans" },
      { label: "Transfers", path: "/ops/accounting/transfers" }
    ]},
    { label: "AI Intelligence", items: [
      { label: "Risk Summary", path: "/ops/ai/risk-summary" },
      { label: "Vacancy Analytics", path: "/ops/ai/vacancy-analytics" },
      { label: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting" },
      { label: "ML Leasing Logs", path: "/ops/ai/ml-leasing-logs" }
    ]},
    { label: "Work Management", items: [
      { label: "Work Orders", path: "/ops/work/work-orders" },
      { label: "Capital Projects", path: "/ops/work/capital-projects" },
      { label: "Build & Repair", path: "/ops/work/build-repair-projects" },
      { label: "Vendors", path: "/ops/work/vendors" },
      { label: "AI Intelligence", path: "/ops/work/ai-intelligence" },
      { label: "Smart Routing", path: "/ops/work/smart-routing" },
      { label: "Materials Inventory", path: "/ops/work/materials-inventory" }
    ]},
    { label: "Legal", items: [
      { label: "Docs", path: "/ops/legal/docs" },
      { label: "Attorney Reports", path: "/ops/legal/attorney-reports" },
      { label: "Case Manager", path: "/ops/legal/case-manager" },
      { label: "Advanced", path: "/ops/legal/advanced" }
    ]},
    { label: "Communications", items: [
      { label: "Logs", path: "/ops/comms/logs" },
      { label: "Queue", path: "/ops/comms/queue" },
      { label: "Templates", path: "/ops/comms/templates" }
    ]}
  ]},

  { label: "Growth", groups: [{ label: "Growth", items: [
    { label: "Marketing", path: "/growth/marketing" },
    { label: "Inventory", path: "/growth/inventory" }
  ]}] },

  { label: "System", groups: [{ label: "System", items: [
    { label: "Settings", path: "/system/settings" },
    { label: "Automation", path: "/system/automation" }
  ]}] },

  { label: "Data Management", groups: [{ label: "Data Management", items: [
    { label: "Raw Data", path: "/data/raw" },
    { label: "Sync Audit", path: "/data/sync-audit" },
    { label: "Sync Logs", path: "/data/sync-logs" }
  ]}] },

  { label: "Investor Portal", groups: [{ label: "Investor Portal", items: [
    { label: "Dashboard", path: "/investor/dashboard" },
    { label: "Financial Reports", path: "/investor/financial-reports" },
    { label: "Portfolio Analytics", path: "/investor/portfolio-analytics" }
  ]}] },

  { label: "Integrations", groups: [{ label: "Integrations", items: [
    { label: "CoreLogic", path: "/integrations/corelogic" },
    { label: "Field App", path: "/integrations/field-app" },
    { label: "Dropbox", path: "/integrations/dropbox" },
    { label: "Deal Room", path: "/integrations/deal-room" }
  ]}] },

  { label: "Tools", groups: [{ label: "Tools", items: [
    { label: "API Probe", path: "/tools/probe" }
  ]}] },
];

export default NAV;
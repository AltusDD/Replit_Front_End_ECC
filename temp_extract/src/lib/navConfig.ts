export type Leaf = { label: string; path: string };
export type Group = { label: string; items: Leaf[] };
export type Section = { label: string; groups: Group[] };

const NAV: Section[] = [
  { label: "Dashboard", groups: [{ label: "Dashboard", items: [{ label: "Home", path: "/dashboard" }] }] },

  { label: "Portfolio", groups: [{ label: "Portfolio", items: [
    { label: "Properties", path: "/properties" },
    { label: "Units", path: "/units" },
    { label: "Leases", path: "/leases" },
    { label: "Tenants", path: "/tenants" },
    { label: "Owners", path: "/owners" }
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
      { label: "AR", path: "/ops/accounting/ar" },
      { label: "AP", path: "/ops/accounting/ap" },
      { label: "GL", path: "/ops/accounting/gl" },
      { label: "Banking", path: "/ops/accounting/banking" },
      { label: "Close", path: "/ops/accounting/close" },
      { label: "Reporting", path: "/ops/accounting/reporting" },
      { label: "Budgets", path: "/ops/accounting/budgets" },
      { label: "Taxes", path: "/ops/accounting/taxes" },
      { label: "Vendors", path: "/ops/accounting/vendors" },
      { label: "Receipts", path: "/ops/accounting/receipts" },
      { label: "Allocations", path: "/ops/accounting/allocations" },
      { label: "Audit Trail", path: "/ops/accounting/audit" }
    ]},
    { label: "Leasing", items: [
      { label: "Applications", path: "/ops/leasing/apps" },
      { label: "Screening", path: "/ops/leasing/screening" },
      { label: "Renewals", path: "/ops/leasing/renewals" },
      { label: "Move-in/Move-out", path: "/ops/leasing/mimo" },
      { label: "Delinquencies", path: "/ops/leasing/delinquencies" }
    ]},
    { label: "Maintenance", items: [
      { label: "Work Orders", path: "/ops/maint/work-orders" },
      { label: "Turns", path: "/ops/maint/turns" },
      { label: "CapEx", path: "/ops/maint/capex" },
      { label: "Vendors", path: "/ops/maint/vendors" }
    ]},
    { label: "Compliance", items: [
      { label: "Docs", path: "/ops/compliance/docs" },
      { label: "Inspections", path: "/ops/compliance/inspections" },
      { label: "Insurance", path: "/ops/compliance/insurance" },
      { label: "Licenses", path: "/ops/compliance/licenses" }
    ]},
    { label: "Vendors", items: [
      { label: "Directory", path: "/ops/vendors/directory" },
      { label: "Onboarding", path: "/ops/vendors/onboarding" },
      { label: "Scorecards", path: "/ops/vendors/scorecards" }
    ]}
  ]},

  { label: "Growth", groups: [{ label: "Growth", items: [
    { label: "Acquisitions", path: "/growth/acquisitions" },
    { label: "Marketing", path: "/growth/marketing" }
  ]}] },

  { label: "System", groups: [{ label: "System", items: [
    { label: "Settings", path: "/system/settings" },
    { label: "Users & Roles", path: "/system/users" }
  ]}] },

  { label: "Data Management", groups: [{ label: "Data Management", items: [
    { label: "Imports", path: "/data/imports" },
    { label: "Exports", path: "/data/exports" },
    { label: "Dedupe", path: "/data/dedupe" },
    { label: "Archives", path: "/data/archives" },
    { label: "Audit Logs", path: "/data/audit" }
  ]}] },

  { label: "Investor Portal", groups: [{ label: "Investor Portal", items: [
    { label: "Overview", path: "/investor/overview" },
    { label: "Distributions", path: "/investor/distributions" },
    { label: "Statements", path: "/investor/statements" }
  ]}] },

  { label: "Integrations", groups: [{ label: "Integrations", items: [
    { label: "DoorLoop", path: "/integrations/doorloop" },
    { label: "QuickBooks", path: "/integrations/quickbooks" },
    { label: "Azure", path: "/integrations/azure" },
    { label: "Webhooks", path: "/integrations/webhooks" }
  ]}] },

  { label: "Tools", groups: [{ label: "Tools", items: [
    { label: "API Probe", path: "/tools/probe" }
  ]}] },
];

export default NAV;
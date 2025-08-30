export type Leaf = { label: string, path: string };
export type Group = { label: string, items: Leaf[] };
export type Section = { label: string, groups: Group[] };

export const NAV: Section[] = [
  {
    label: "Primary",
    groups: [
      { label: "Dashboard", items: [ { label: "Dashboard", path: "/dashboard" } ] }
    ]
  },
  {
    label: "Portfolio",
    groups: [
      { label: "Assets", items: [
        { label: "Properties", path: "/properties" },
        { label: "Units", path: "/units" },
        { label: "Leases", path: "/leases" },
        { label: "Tenants", path: "/tenants" },
        { label: "Owners", path: "/owners" }
      ]}
    ]
  },
  {
    label: "Cards",
    groups: [
      { label: "Workflow", items: [
        { label: "Inbox", path: "/inbox" },
        { label: "Tasks", path: "/tasks" },
        { label: "Opportunities", path: "/opportunities" },
        { label: "Anomalies", path: "/anomalies" },
        { label: "Next Best Action", path: "/next-best-action" }
      ]}
    ]
  },
  {
    label: "Accounting",
    groups: [
      { label: "Operations", items: [
        { label: "AR", path: "/ar" },
        { label: "AP", path: "/ap" },
        { label: "GL", path: "/gl" },
        { label: "Banking", path: "/banking" },
        { label: "Close", path: "/close" },
        { label: "Reporting", path: "/reporting" },
        { label: "Budgets", path: "/budgets" },
        { label: "Taxes", path: "/taxes" },
        { label: "Vendors", path: "/vendors-accounting" },
        { label: "Receipts", path: "/receipts" },
        { label: "Allocations", path: "/allocations" },
        { label: "Audit Trail", path: "/audit-trail" }
      ]}
    ]
  },
  {
    label: "Leasing",
    groups: [
      { label: "Process", items: [
        { label: "Applications", path: "/applications" },
        { label: "Screening", path: "/screening" },
        { label: "Renewals", path: "/renewals" },
        { label: "Move-in/Move-out", path: "/move" },
        { label: "Delinquencies", path: "/delinquencies" }
      ]}
    ]
  },
  {
    label: "Maintenance",
    groups: [
      { label: "Operations", items: [
        { label: "Work Orders", path: "/work-orders" },
        { label: "Turns", path: "/turns" },
        { label: "CapEx", path: "/capex" },
        { label: "Vendors", path: "/vendors-maintenance" }
      ]}
    ]
  },
  {
    label: "Compliance",
    groups: [
      { label: "Legal", items: [
        { label: "Docs", path: "/docs" },
        { label: "Inspections", path: "/inspections" },
        { label: "Insurance", path: "/insurance" },
        { label: "Licenses", path: "/licenses" }
      ]}
    ]
  },
  {
    label: "Vendors",
    groups: [
      { label: "Management", items: [
        { label: "Directory", path: "/directory" },
        { label: "Onboarding", path: "/onboarding" },
        { label: "Scorecards", path: "/scorecards" }
      ]}
    ]
  },
  {
    label: "Growth",
    groups: [
      { label: "Pipeline", items: [
        { label: "Acquisitions", path: "/acquisitions" },
        { label: "Marketing", path: "/marketing" }
      ]}
    ]
  },
  {
    label: "System",
    groups: [
      { label: "Admin", items: [
        { label: "Settings", path: "/settings" },
        { label: "Users & Roles", path: "/users" }
      ]}
    ]
  },
  {
    label: "Data",
    groups: [
      { label: "Management", items: [
        { label: "Imports", path: "/imports" },
        { label: "Exports", path: "/exports" },
        { label: "Dedupe", path: "/dedupe" },
        { label: "Archives", path: "/archives" },
        { label: "Audit Logs", path: "/audit-logs" }
      ]}
    ]
  },
  {
    label: "Investor",
    groups: [
      { label: "Portal", items: [
        { label: "Overview", path: "/investor-overview" },
        { label: "Distributions", path: "/distributions" },
        { label: "Statements", path: "/statements" }
      ]}
    ]
  },
  {
    label: "Integrations",
    groups: [
      { label: "Connections", items: [
        { label: "DoorLoop", path: "/doorloop" },
        { label: "QuickBooks", path: "/quickbooks" },
        { label: "Azure", path: "/azure" },
        { label: "Webhooks", path: "/webhooks" }
      ]}
    ]
  },
  {
    label: "Tools",
    groups: [
      { label: "System", items: [
        { label: "API Probe", path: "/api-probe" }
      ]}
    ]
  }
];

export function flattenLeaves() {
  const leaves: Leaf[] = [];
  for (const sec of NAV) {
    for (const grp of sec.groups) {
      grp.items.forEach(leaf => leaves.push(leaf));
    }
  }
  return leaves;
}
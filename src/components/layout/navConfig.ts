export type Leaf = { label: string; path: string };
export type Group = { label: string; children: Leaf[] };
export type Section = { label: string; items: (Leaf | Group)[] };

export const NAV: Section[] = [
  {
    label: "Primary",
    items: [
      { label: "Dashboard", path: "/dashboard" }
    ]
  },
  {
    label: "Portfolio V3", 
    items: [
      { label: "Properties", path: "/portfolio/properties" },
      { label: "Units", path: "/portfolio/units" },
      { label: "Leases", path: "/portfolio/leases" },
      { label: "Tenants", path: "/portfolio/tenants" },
      { label: "Owners", path: "/portfolio/owners" }
    ]
  },
  {
    label: "Cards",
    items: [
      { label: "Property Card", path: "/card/property/:id" },
      { label: "Unit Card", path: "/card/unit/:id" },
      { label: "Lease Card", path: "/card/lease/:id" },
      { label: "Tenant Card", path: "/card/tenant/:id" },
      { label: "Owner Card", path: "/card/owner/:id" }
    ]
  },
  {
    label: "Operations",
    items: [
      {
        label: "Accounting",
        children: [
          { label: "Overview", path: "/ops/accounting/overview" },
          { label: "Rent Collection", path: "/ops/accounting/rent-collection" },
          { label: "Expenses", path: "/ops/accounting/expenses" },
          { label: "Financial Reports", path: "/ops/accounting/financial-reports" },
          { label: "Tenant Ledgers", path: "/ops/accounting/tenant-ledgers" },
          { label: "Collections Dashboard", path: "/ops/accounting/collections-dashboard" },
          { label: "Collections Log", path: "/ops/accounting/collections-log" },
          { label: "Payment Plans", path: "/ops/accounting/payment-plans" },
          { label: "Deposits", path: "/ops/accounting/deposits" },
          { label: "Transfers", path: "/ops/accounting/transfers" },
          { label: "Subsidized Housing", path: "/ops/accounting/subsidized-housing" },
          { label: "Assistance Programs", path: "/ops/accounting/assistance-programs" }
        ]
      },
      {
        label: "AI Analytics",
        children: [
          { label: "Risk Summary", path: "/ops/ai/risk-summary" },
          { label: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting" },
          { label: "Vacancy Analytics", path: "/ops/ai/vacancy-analytics" },
          { label: "ML Leasing Logs", path: "/ops/ai/ml-leasing-logs" }
        ]
      },
      {
        label: "Legal Tracker",
        children: [
          { label: "Case Manager", path: "/ops/legal/case-manager" },
          { label: "Advanced Legal Ops", path: "/ops/legal/advanced" },
          { label: "Legal Docs", path: "/ops/legal/docs" },
          { label: "Attorney Reports", path: "/ops/legal/attorney-reports" }
        ]
      },
      {
        label: "Communication",
        children: [
          { label: "Queue", path: "/ops/comms/queue" },
          { label: "Templates", path: "/ops/comms/templates" },
          { label: "Logs", path: "/ops/comms/logs" }
        ]
      },
      {
        label: "Work Orders",
        children: [
          { label: "Work Orders", path: "/ops/work/work-orders" },
          { label: "Vendors", path: "/ops/work/vendors" },
          { label: "Materials & Inventory", path: "/ops/work/materials-inventory" },
          { label: "Smart Routing", path: "/ops/work/smart-routing" },
          { label: "AI Intelligence", path: "/ops/work/ai-intelligence" },
          { label: "Build/Repair Projects", path: "/ops/work/build-repair-projects" },
          { label: "Capital Projects", path: "/ops/work/capital-projects" }
        ]
      },
      { label: "Reports", path: "/ops/reports" }
    ]
  },
  {
    label: "Growth",
    items: [
      { label: "Inventory", path: "/growth/inventory" },
      { label: "Marketing", path: "/growth/marketing" }
    ]
  },
  {
    label: "System",
    items: [
      { label: "Automation", path: "/system/automation" },
      { label: "Settings", path: "/system/settings" }
    ]
  },
  {
    label: "Data Management",
    items: [
      { label: "Sync Audit", path: "/data/sync-audit" },
      { label: "Sync Management", path: "/data/sync-management" },
      { label: "Raw Data", path: "/data/raw" },
      { label: "Sync Logs", path: "/data/sync-logs" },
      { label: "System Settings", path: "/data/system-settings" }
    ]
  },
  {
    label: "Investor Portal",
    items: [
      { label: "Dashboard", path: "/investor/dashboard" },
      { label: "Portfolio Analytics", path: "/investor/portfolio-analytics" },
      { label: "Financial Reports", path: "/investor/financial-reports" }
    ]
  },
  {
    label: "Integrations",
    items: [
      { label: "Dropbox Files", path: "/integrations/dropbox" },
      { label: "CoreLogic / MLS Grid", path: "/integrations/corelogic" },
      { label: "Field App Link", path: "/integrations/field-app" },
      { label: "Deal Room Link", path: "/integrations/deal-room" }
    ]
  }
];

export function flattenLeaves(): Leaf[] {
  const leaves: Leaf[] = [];
  for (const section of NAV) {
    for (const item of section.items) {
      if ('path' in item) {
        leaves.push(item);
      } else {
        leaves.push(...item.children);
      }
    }
  }
  return leaves;
}
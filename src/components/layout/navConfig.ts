// ECC Navigation Configuration - Canonical Structure
export type Leaf = { label: string; to: string };
export type Group = { label: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

const sections: Section[] = [
  {
    title: "Primary",
    items: [{ label: "Dashboard", to: "/dashboard" }],
  },
  {
    title: "Portfolio V3",
    items: [
      { label: "Properties", to: "/portfolio/properties" },
      { label: "Units", to: "/portfolio/units" },
      { label: "Leases", to: "/portfolio/leases" },
      { label: "Tenants", to: "/portfolio/tenants" },
      { label: "Owners", to: "/portfolio/owners" },
    ],
  },
  {
    title: "Cards (Entity Hubs)",
    items: [
      { label: "Property Card", to: "/card/property" },
      { label: "Unit Card", to: "/card/unit" },
      { label: "Lease Card", to: "/card/lease" },
      { label: "Tenant Card", to: "/card/tenant" },
      { label: "Owner Card", to: "/card/owner" },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Accounting",
        children: [
          { label: "Overview", to: "/ops/accounting/overview" },
          { label: "Rent Collection", to: "/ops/accounting/rent-collection" },
          { label: "Expenses", to: "/ops/accounting/expenses" },
          { label: "Financial Reports", to: "/ops/accounting/financial-reports" },
          { label: "Tenant Ledgers", to: "/ops/accounting/tenant-ledgers" },
          { label: "Collections Dashboard", to: "/ops/accounting/collections-dashboard" },
          { label: "Collections Log", to: "/ops/accounting/collections-log" },
          { label: "Payment Plans", to: "/ops/accounting/payment-plans" },
          { label: "Deposits", to: "/ops/accounting/deposits" },
          { label: "Transfers", to: "/ops/accounting/transfers" },
          { label: "Subsidized Housing", to: "/ops/accounting/subsidized-housing" },
          { label: "Assistance Programs", to: "/ops/accounting/assistance-programs" },
        ],
      },
      {
        label: "AI Analytics",
        children: [
          { label: "Risk Summary", to: "/ops/ai/risk-summary" },
          { label: "Renewal Forecasting", to: "/ops/ai/renewal-forecasting" },
          { label: "Vacancy Analytics", to: "/ops/ai/vacancy-analytics" },
          { label: "ML Leasing Logs", to: "/ops/ai/ml-leasing-logs" },
        ],
      },
      {
        label: "Legal Tracker",
        children: [
          { label: "Case Manager", to: "/ops/legal/case-manager" },
          { label: "Advanced Legal Ops", to: "/ops/legal/advanced" },
          { label: "Legal Docs", to: "/ops/legal/docs" },
        ],
      },
    ],
  },
];

export { sections };
export default sections;
export type Leaf = { label: string; to: string };
export type Group = { label: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

const sections: Section[] = [
  { title: "Dashboard", items: [{ label: "Home", to: "/dashboard" }] },
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
    title: "Cards",
    items: [
      { label: "Overview", to: "/cards/overview" },
      { label: "Delinquencies", to: "/cards/delinquencies" },
      { label: "Vacancy", to: "/cards/vacancy" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Accounting", to: "/operations/accounting" },
      { label: "Leasing", to: "/operations/leasing" },
      { label: "Maintenance", to: "/operations/maintenance" },
      { label: "Marketing", to: "/operations/marketing" },
    ],
  },
];

export { sections };
export default sections;

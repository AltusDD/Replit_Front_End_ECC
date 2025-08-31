export type Leaf = { label: string; to: string; icon: string };
export type Group = { label: string; icon: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

const sections: Section[] = [
  {
    title: "Dashboard",
    items: [{ label: "Home", to: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "Portfolio V3",
    items: [
      { label: "Properties", to: "/portfolio/properties", icon: "Building" },
      { label: "Units", to: "/portfolio/units", icon: "Layers" },
      { label: "Leases", to: "/portfolio/leases", icon: "FileText" },
      { label: "Tenants", to: "/portfolio/tenants", icon: "Users" },
      { label: "Owners", to: "/portfolio/owners", icon: "UserCheck" },
    ],
  },
  {
    title: "Cards",
    items: [
      { label: "Overview", to: "/cards/overview", icon: "BarChart3" },
      { label: "Delinquencies", to: "/cards/delinquencies", icon: "AlertCircle" },
      { label: "Vacancy", to: "/cards/vacancy", icon: "DoorOpen" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Accounting", to: "/operations/accounting", icon: "Wallet" },
      { label: "Leasing", to: "/operations/leasing", icon: "Handshake" },
      { label: "Maintenance", to: "/operations/maintenance", icon: "Hammer" },
      { label: "Marketing", to: "/operations/marketing", icon: "Megaphone" },
    ],
  },
];

export { sections };
export default sections;

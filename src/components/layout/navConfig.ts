export type Leaf = { label: string; to: string; icon: string };
export type Group = { label: string; icon: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

const sections: Section[] = [
  {
    title: "Primary",
    items: [{ label: "Dashboard", to: "/dashboard", icon: "Home" }],
  },
  {
    title: "Portfolio V3",
    items: [
      { label: "Properties", to: "/portfolio/properties", icon: "Layers" },
      { label: "Units", to: "/portfolio/units", icon: "Box" },
      { label: "Leases", to: "/portfolio/leases", icon: "FileText" },
      { label: "Tenants", to: "/portfolio/tenants", icon: "User" },
      { label: "Owners", to: "/portfolio/owners", icon: "Users" },
    ],
  },
  {
    title: "Cards",
    items: [
      { label: "Property Card", to: "/card/property/:id", icon: "Grid" },
      { label: "Unit Card", to: "/card/unit/:id", icon: "Package" },
      // Remaining items...
    ],
  },
  // Additional sections...
];

export default sections;
export type Leaf = {
  label: string;
  path: string;
};

export type Group = {
  label: string;
  icon: string;
  items: Leaf[];
};

export type Section = {
  label: string;
  groups: Group[];
};

export const NAV: Section[] = [
  {
    label: "Primary",
    groups: [
      {
        label: "Dashboard",
        icon: "Home",
        items: [{ label: "Dashboard", path: "/dashboard" }]
      }
    ]
  },
  {
    label: "Portfolio",
    groups: [
      {
        label: "Portfolio",
        icon: "Building2",
        items: [
          { label: "Properties", path: "/properties" },
          { label: "Units", path: "/units" },
          { label: "Leases", path: "/leases" },
          { label: "Tenants", path: "/tenants" },
          { label: "Owners", path: "/owners" }
        ]
      }
    ]
  }
  // Continue for Cards, Accounting, Leasing, Maintenance, etc.
];
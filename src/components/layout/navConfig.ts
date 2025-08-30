export type Leaf = { label: string; path: string };
export type Group = { label: string; items: Leaf[] };
export type Section = { label: string; groups: Group[] };

export const NAV: Section[] = [
  {
    label: "Primary",
    groups: [
      {
        label: "Essentials",
        items: [
          { label: "Dashboard", path: "/dashboard" },
        ]
      }
    ]
  },
  {
    label: "Portfolio",
    groups: [
      {
        label: "Assets",
        items: [
          { label: "Properties", path: "/portfolio/properties" },
          { label: "Units", path: "/portfolio/units" },
          { label: "Leases", path: "/portfolio/leases" },
          { label: "Tenants", path: "/portfolio/tenants" },
          { label: "Owners", path: "/portfolio/owners" },
        ]
      }
    ]
  },
  {
    label: "System",
    groups: [
      {
        label: "Configuration",
        items: [
          { label: "Settings", path: "/system/settings" },
          { label: "Users & Roles", path: "/system/users" },
        ]
      }
    ]
  },
  {
    label: "Integrations",
    groups: [
      {
        label: "Partners",
        items: [
          { label: "DoorLoop", path: "/integrations/doorloop" },
          { label: "QuickBooks", path: "/integrations/quickbooks" },
          { label: "Azure", path: "/integrations/azure" },
          { label: "Webhooks", path: "/integrations/webhooks" },
        ]
      }
    ]
  }
];

export function flattenLeaves() {
  const leaves: Leaf[] = [];
  for (const sec of NAV)
    for (const grp of sec.groups)
      leaves.push(...grp.items);
  return leaves;
}
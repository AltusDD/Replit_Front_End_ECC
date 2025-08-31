export type Leaf = { label: string; path: string };
export type Group = { label: string; items: Leaf[] };
export type Section = { label: string; groups: Group[] };

/**
 * Canonical Navigation (approved)
 * - Dashboard
 * - Portfolio V3
 * - Cards (placeholder groups for now)
 * - Operations (placeholders)
 * - AI Intelligence (placeholder)
 * - Work Management (placeholder)
 * - Legal (placeholder)
 * - Tools / Probe
 *
 * NOTE: Empty groups render as headings; they won't break routing.
 */
const NAV: Section[] = [
  { label: "Dashboard", groups: [
    { label: "Dashboard", items: [ { label: "Home", path: "/dashboard" } ] }
  ]},

  { label: "Portfolio V3", groups: [
    { label: "Portfolio", items: [
      { label: "Properties", path: "/portfolio/properties" },
      { label: "Units",      path: "/portfolio/units" },
      { label: "Leases",     path: "/portfolio/leases" },
      { label: "Tenants",    path: "/portfolio/tenants" },
      { label: "Owners",     path: "/portfolio/owners" }
    ]}
  ]},

  { label: "Cards", groups: [
    { label: "Cards", items: [] }
  ]},

  { label: "Operations", groups: [
    { label: "Accounting", items: [] }
  ]},

  { label: "AI Intelligence", groups: [
    { label: "AI", items: [] }
  ]},

  { label: "Work Management", groups: [
    { label: "Work", items: [] }
  ]},

  { label: "Legal", groups: [
    { label: "Legal", items: [] }
  ]},

  { label: "Tools", groups: [
    { label: "Tools", items: [ { label: "Probe", path: "/tools/probe" } ] }
  ]}
];

export default NAV;

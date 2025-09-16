// src/components/layout/navConfig.ts
// Minimal, contract-safe nav model that Sidebar can consume.
// Exports both `default` and named to satisfy any import style.

export type NavLink = {
  label: string;
  to: string;
  testid?: string;
};

export type NavSection = {
  title: string;
  items: NavLink[];
};

export const navSections: NavSection[] = [
  {
    title: "Portfolio",
    items: [
      { label: "Dashboard", to: "/dashboard", testid: "nav-dashboard" },
      { label: "Properties", to: "/portfolio/properties", testid: "nav-properties" },
      { label: "Units", to: "/portfolio/units", testid: "nav-units" },
      { label: "Leases", to: "/portfolio/leases", testid: "nav-leases" },
      { label: "Tenants", to: "/portfolio/tenants", testid: "nav-tenants" },
      { label: "Owners", to: "/portfolio/owners", testid: "nav-owners" }
    ],
  },
  {
    title: "Cards",
    items: [
      // These are examples; the pages resolve the actual IDs.
      { label: "Property Card", to: "/card/property/1", testid: "nav-card-property" },
      { label: "Unit Card", to: "/card/unit/1", testid: "nav-card-unit" },
      { label: "Lease Card", to: "/card/lease/1", testid: "nav-card-lease" },
      { label: "Tenant Card", to: "/card/tenant/1", testid: "nav-card-tenant" },
      { label: "Owner Card", to: "/card/owner/1", testid: "nav-card-owner" }
    ],
  },
];

// Some code prefers a flat list; provide both shapes:
export const navItems: NavLink[] = navSections.flatMap(s => s.items);

// Default export for Sidebar variants that expect default:
const navConfig = { sections: navSections, items: navItems };
export default navConfig;
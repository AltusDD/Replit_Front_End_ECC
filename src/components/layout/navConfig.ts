export type NavItem = { label: string; path: string };
export type NavSection = { title: string; items: NavItem[] };

export const NAV: NavSection[] = [
  { title: 'PRIMARY', items: [{ label: 'Dashboard', path: '/dashboard' }] },
  {
    title: 'PORTFOLIO V3',
    items: [
      { label: 'Properties', path: '/portfolio/properties' },
      { label: 'Units', path: '/portfolio/units' },
      { label: 'Leases', path: '/portfolio/leases' },
      { label: 'Tenants', path: '/portfolio/tenants' },
      { label: 'Owners', path: '/portfolio/owners' },
    ],
  },
  { title: 'TOOLS', items: [{ label: 'API Probe', path: '/tools/probe' }] },
];

// Default export for backwards compatibility
export default NAV;

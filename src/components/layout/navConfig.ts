export type NavItem = { label: string; path?: string; children?: NavItem[] };
export const NAV_SECTIONS: NavItem[] = [
  {
    label: 'PRIMARY',
    children: [{ label: 'Dashboard', path: '/dashboard' }],
  },
  {
    label: 'PORTFOLIO V3',
    children: [
      { label: 'Properties', path: '/portfolio/properties' },
      { label: 'Units',      path: '/portfolio/units' },
      { label: 'Leases',     path: '/portfolio/leases' },
      { label: 'Tenants',    path: '/portfolio/tenants' },
      { label: 'Owners',     path: '/portfolio/owners' },
    ],
  },
  {
    label: 'TOOLS',
    children: [{ label: 'API Probe', path: '/tools/probe' }],
  },
];

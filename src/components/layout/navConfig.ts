export default [
  { section: 'PRIMARY', items: [
    { label: 'Dashboard', href: '/dashboard' },
  ]},
  { section: 'PORTFOLIO V3', items: [
    { label: 'Properties', href: '/portfolio/properties' },
    { label: 'Units',      href: '/portfolio/units' },
    { label: 'Leases',     href: '/portfolio/leases' },
    { label: 'Tenants',    href: '/portfolio/tenants' },
    { label: 'Owners',     href: '/portfolio/owners' },
  ]},
  { section: 'TOOLS', items: [
    { label: 'API Probe', href: '/tools/probe' },
  ]},
] as const

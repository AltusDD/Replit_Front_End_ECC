export default [
  { title: 'PRIMARY', items: [
    { label: 'Dashboard', href: '/dashboard' },
  ]},
  { title: 'PORTFOLIO V3', items: [
    { label: 'Properties', href: '/portfolio/properties' },
    { label: 'Units',      href: '/portfolio/units' },
    { label: 'Leases',     href: '/portfolio/leases' },
    { label: 'Tenants',    href: '/portfolio/tenants' },
    { label: 'Owners',     href: '/portfolio/owners' },
  ]},
  { title: 'TOOLS', items: [
    { label: 'API Probe', href: '/tools/probe' },
  ]},
] as const

import { Link, useRoute } from 'wouter';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isActive] = useRoute(href);
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        margin: '6px 0',
        textDecoration: 'none',
        color: 'var(--text)',
        fontWeight: isActive ? 700 : 500,
      }}
    >
      {children}
    </Link>
  );
}

export default function Nav() {
  return (
    <nav>
      <div style={{ fontSize: 12, letterSpacing: 0.5, color: 'var(--muted)', textTransform: 'uppercase', margin: '10px 0 6px' }}>Primary</div>
      <NavLink href="/dashboard">Dashboard</NavLink>

      <div style={{ fontSize: 12, letterSpacing: 0.5, color: 'var(--muted)', textTransform: 'uppercase', margin: '18px 0 6px' }}>Portfolio V3</div>
      <NavLink href="/portfolio/properties">Properties</NavLink>
      <NavLink href="/portfolio/units">Units</NavLink>
      <NavLink href="/portfolio/leases">Leases</NavLink>
      <NavLink href="/portfolio/tenants">Tenants</NavLink>
      <NavLink href="/portfolio/owners">Owners</NavLink>

      <div style={{ fontSize: 12, letterSpacing: 0.5, color: 'var(--muted)', textTransform: 'uppercase', margin: '18px 0 6px' }}>Tools</div>
      <NavLink href="/tools/probe">API Probe</NavLink>
    </nav>
  );
}
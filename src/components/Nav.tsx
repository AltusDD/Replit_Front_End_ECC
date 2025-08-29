import { Link, useRoute } from 'wouter';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isActive] = useRoute(href === '/' ? '/' : `${href}/*`);
  return (
    <Link href={href}>
      <span
        style={{
          display: 'block',
          padding: '8px 10px',
          borderRadius: 8,
          color: isActive ? '#fff' : 'var(--muted)',
          background: isActive ? 'rgba(59,130,246,.18)' : 'transparent'
        }}
      >
        {children}
      </span>
    </Link>
  );
}

export default function Nav() {
  return (
    <nav style={{ display: 'grid', gap: 6 }}>
      <div style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '.06em', marginTop: 8 }}>PRIMARY</div>
      <NavLink href="/dashboard">Dashboard</NavLink>

      <div style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '.06em', marginTop: 12 }}>PORTFOLIO V3</div>
      <NavLink href="/portfolio/properties">Properties</NavLink>
      <NavLink href="/portfolio/units">Units</NavLink>
      <NavLink href="/portfolio/leases">Leases</NavLink>
      <NavLink href="/portfolio/tenants">Tenants</NavLink>
      <NavLink href="/portfolio/owners">Owners</NavLink>

      <div style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '.06em', marginTop: 12 }}>TOOLS</div>
      <NavLink href="/tools/probe">API Probe</NavLink>
    </nav>
  );
}

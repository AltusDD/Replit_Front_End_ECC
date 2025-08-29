import { Link, useRoute } from 'wouter';
function NavLink({ href, children }:{href:string;children:React.ReactNode}) {
  const [active] = useRoute(href === '/' ? '/' : `${href}/*`);
  return (
    <Link href={href} className={active ? 'active' : ''}>
      {children}
    </Link>
  );
}
export default function Nav(){
  return (
    <nav>
      <div className="section-title">PRIMARY</div>
      <NavLink href="/dashboard">Dashboard</NavLink>
      <div className="section-title">PORTFOLIO V3</div>
      <NavLink href="/portfolio/properties">Properties</NavLink>
      <NavLink href="/portfolio/units">Units</NavLink>
      <NavLink href="/portfolio/leases">Leases</NavLink>
      <NavLink href="/portfolio/tenants">Tenants</NavLink>
      <NavLink href="/portfolio/owners">Owners</NavLink>
      <div className="section-title">TOOLS</div>
      <NavLink href="/tools/probe">API Probe</NavLink>
    </nav>
  );
}

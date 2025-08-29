import React from 'react';
import { Link, useRoute } from 'wouter';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isActive] = useRoute(href === '/' ? '/' : `${href}/*`); // highlights section
  return <Link href={href} className={`nav-link ${isActive ? 'active' : ''}`}>{children}</Link>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">Empire Command Center</div>

        <div className="nav-section">PRIMARY</div>
        <nav className="nav">
          <NavLink href="/dashboard">Dashboard</NavLink>
        </nav>

        <div className="nav-section">PORTFOLIO V3</div>
        <nav className="nav">
          <NavLink href="/portfolio/properties">Properties</NavLink>
          <NavLink href="/portfolio/units">Units</NavLink>
          <NavLink href="/portfolio/leases">Leases</NavLink>
          <NavLink href="/portfolio/tenants">Tenants</NavLink>
          <NavLink href="/portfolio/owners">Owners</NavLink>
        </nav>

        <div className="nav-section">TOOLS</div>
        <nav className="nav">
          <NavLink href="/tools/probe">API Probe</NavLink>
        </nav>
      </aside>

      <main className="main">
        {children}
      </main>
    </div>
  );
}

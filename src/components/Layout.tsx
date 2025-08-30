import { Link, useLocation } from 'wouter';
import { NAV } from './layout/navConfig';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (!collapsed) setPinned(false);
  };

  const togglePin = () => {
    setPinned(!pinned);
    if (!pinned) setCollapsed(false);
  };

  // Group nav items by section
  const sections = ['PRIMARY', 'PORTFOLIO', 'TOOLS'] as const;
  const navBySection = sections.map(sectionName => ({
    title: sectionName,
    items: NAV.filter(item => item.section === sectionName)
  }));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand">
          {!collapsed && 'Empire Command Center'}
          {collapsed && 'ECC'}
        </div>
        <div className="controls">
          <button onClick={togglePin}>{pinned ? '📌' : '📍'}</button>
          <button onClick={toggleCollapsed}>{collapsed ? '→' : '←'}</button>
        </div>
        
        <nav>
          {navBySection.map(section => (
            <div key={section.title}>
              <div className="section-title">
                {!collapsed && section.title}
              </div>
              {section.items.map(item => {
                const active = loc === item.href || (item.href !== '/dashboard' && loc.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={active ? 'active' : ''}
                    title={collapsed ? item.label : undefined}
                  >
                    {collapsed ? item.label.charAt(0) : item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
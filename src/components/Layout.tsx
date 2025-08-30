import { Link, useLocation } from 'wouter';
import { NAV } from './layout/navConfig';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (!collapsed) setPinned(false); // Auto-unpin when collapsing
  };

  const togglePin = () => {
    setPinned(!pinned);
    if (!pinned) setCollapsed(false); // Auto-expand when pinning
  };

  return (
    <div className="app-shell">
      <aside className={`ec-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            {!collapsed && 'Empire Command Center'}
            {collapsed && 'ECC'}
          </div>
          <div className="sidebar-controls">
            <button
              className="pin-btn"
              onClick={togglePin}
              title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              📌
            </button>
            <button
              className="collapse-btn"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((section) => (
            <div className="nav-section" key={section.title}>
              <div className="nav-section-title">{!collapsed && section.title}</div>
              <div className="nav-items">
                {section.items.map((item) => {
                  const active =
                    loc === item.path || (item.path !== '/dashboard' && loc.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`nav-item ${active ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="nav-label">
                        {collapsed ? item.label.charAt(0) : item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className={`ec-content ${collapsed ? 'sidebar-collapsed' : ''}`}>{children}</main>
    </div>
  );
}

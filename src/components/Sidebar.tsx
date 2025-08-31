// src/components/Sidebar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { NAV_SECTIONS, NavItem } from "./layout/navConfig";
import { Pin, PinOff } from "lucide-react";

const LS = {
  get<T>(k: string, d: T): T {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  },
  set<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function ItemIcon({ item }: { item: NavItem }) {
  const Ico = item.icon;
  return Ico ? <Ico className="ecc-link__icon" /> : null;
}

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const [location] = useLocation();
  const active = location === item.href;
  return (
    <Link href={item.href} onClick={onNavigate}>
      <a className={`ecc-link ${active ? "is-active" : ""}`}>
        <ItemIcon item={item} />
        <span className="ecc-link__label">{item.label}</span>
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(LS.get("ecc:nav:collapsed", false));
  const [pinned, setPinned] = useState<boolean>(LS.get("ecc:nav:pinned", true));

  useEffect(() => LS.set("ecc:nav:collapsed", collapsed), [collapsed]);
  useEffect(() => LS.set("ecc:nav:pinned", pinned), [pinned]);

  return (
    <aside className={`ecc-sidebar ${collapsed ? "ecc--collapsed" : ""}`}>
      <div className="ecc-sidebar__inner">
        {/* Brand header */}
        <div className="ecc-sidebar__brand">
          <div className="ecc-logo-box">
            <img
              src="/brand/altus-logo.png"
              alt="Altus Realty Group"
              className="ecc-logo"
            />
            {/* compact mark for collapsed mode */}
            <div className="ecc-logo-mini" aria-hidden>A</div>
          </div>

          <button
            className="ecc-pin"
            title={pinned ? "Unpin" : "Pin"}
            onClick={() => setPinned((v) => !v)}
          >
            {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Groups */}
        <nav className="ecc-groups" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="ecc-group"
              onMouseEnter={() => !pinned && setCollapsed(true)}
              onMouseLeave={() => !pinned && setCollapsed(false)}
            >
              <div className="ecc-group__title">
                {section.icon ? <section.icon className="ecc-group__icon" /> : null}
                <span>{section.title}</span>
              </div>

              <div className="ecc-group__list">
                {section.items.map((it) => (
                  <NavLinkItem key={it.href} item={it} />
                ))}
              </div>

              {/* Flyout when collapsed */}
              <div className="ecc-flyout">
                <div className="ecc-flyout__header">{section.title}</div>
                <div className="ecc-flyout__list">
                  {section.items.map((it) => (
                    <NavLinkItem key={it.href} item={it} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="ecc-collapse">
          <button onClick={() => setCollapsed((v) => !v)} aria-pressed={collapsed}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
    </aside>
  );
}

const STORAGE_KEY = "ecc.sidebar.collapsed";

function ItemIcon({ item }: { item: NavItem }) {
  if (!item.icon) return null;
  const Ico = item.icon;
  return <Ico className="ecc-link__icon" />;
}

export default function Sidebar() {
  // If you use react-router-dom, replace with: const location = useLocation();
  const [location] = useLocation();
  const activePath = location;

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const sections = useMemo(() => NAV_SECTIONS, []);

  return (
    <aside
      className={`ecc-sidebar ${collapsed ? "ecc--collapsed" : ""}`}
      data-ecc="primary"
      aria-label="Primary navigation"
    >
      <div className="ecc-brand">
        <a href="/" className="ecc-brand__link" aria-label="Altus home">
          <img className="ecc-brand__logo" src="/brand/altus-logo.png" alt="Altus" />
          {!collapsed && <span className="ecc-brand__text">Altus</span>}
        </a>
      </div>

      <nav className="ecc-nav" role="navigation">
        {sections.map((section) => (
          <div key={section.id} className="ecc-group" data-group={section.id}>
            <div className="ecc-group__header" title={section.title}>
              {section.icon && React.createElement(section.icon, { className: "ecc-group__icon" })}
              {!collapsed && <span className="ecc-group__title">{section.title}</span>}
            </div>

            <ul className="ecc-group__list">
              {section.items.map((item) => {
                const isActive =
                  activePath === item.href ||
                  (item.href !== "/" && activePath?.startsWith(item.href));
                return (
                  <li key={item.href} className="ecc-item">
                    <a
                      href={item.href}
                      className={`ecc-link ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon &&
                        React.createElement(item.icon, { className: "ecc-link__icon" })}
                      {!collapsed && <span className="ecc-link__label">{item.label}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Flyout for collapsed state */}
            <div className="ecc-flyout" role="menu" aria-label={section.title}>
              <div className="ecc-flyout__title">{section.title}</div>
              <ul>
                {section.items.map((item) => {
                  const isActive =
                    activePath === item.href ||
                    (item.href !== "/" && activePath?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`ecc-flyout__link ${isActive ? "is-active" : ""}`}
                        role="menuitem"
                      >
                        {item.icon &&
                          React.createElement(item.icon, { className: "ecc-flyout__icon" })}
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </nav>

      <button
        className="ecc-pin"
        onClick={() => setCollapsed((v) => !v)}
        aria-pressed={collapsed}
        aria-label={collapsed ? "Pin sidebar (expand)" : "Unpin sidebar (collapse)"}
      >
        {collapsed ? <Pin className="ecc-pin__icon" /> : <PinOff className="ecc-pin__icon" />}
        {!collapsed && <span className="ecc-pin__text">{collapsed ? "Pin" : "Unpin"}</span>}
      </button>
    </aside>
  );
}
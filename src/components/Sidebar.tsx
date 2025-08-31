// src/components/Sidebar.tsx
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { NAV_SECTIONS, type NavItem } from "./layout/navConfig";
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

function NavLinkItem({ item }: { item: NavItem }) {
  const [location] = useLocation();
  const active = location === item.href;
  return (
    <Link href={item.href}>
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
        {/* Brand */}
        <div className="ecc-sidebar__brand">
          <div className="ecc-logo-box">
            {/* full logo when expanded */}
            <img
              src="/brand/altus-logo.png"
              alt="Altus Realty Group"
              className="ecc-logo"
              loading="eager"
            />
            {/* compact shield when collapsed */}
            <img
              src="/brand/altus-mark.png"
              alt=""
              className="ecc-logo-mini-img"
              aria-hidden="true"
            />
          </div>

          <button className="ecc-pin" title={pinned ? "Unpin" : "Pin"} onClick={() => setPinned(v => !v)}>
            {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Groups */}
        <nav className="ecc-groups" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="ecc-group">
              <div className="ecc-group__title">
                {section.icon ? <section.icon className="ecc-group__icon" /> : null}
                <span>{section.title}</span>
              </div>

              <div className="ecc-group__list">
                {section.items.map((it) => (
                  <NavLinkItem key={it.href} item={it} />
                ))}
              </div>

              {/* Flyout visible only when collapsed */}
              <div className="ecc-flyout">
                <div className="ecc-flyout__header">{section.title}</div>
                <div className="ecc-flyout__list">
                  {section.items.map((it) => (
                    <NavLinkItem key={`${section.id}:${it.href}`} item={it} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse control */}
        <div className="ecc-collapse">
          <button onClick={() => setCollapsed(v => !v)} aria-pressed={collapsed}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
    </aside>
  );
}
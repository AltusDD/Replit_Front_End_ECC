import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import type { NavItem, NavSection } from "./layout/navConfig";
import { NAV_SECTIONS } from "./layout/navConfig";

const STORAGE_KEY = "ecc.sidebar.collapsed";

/** Get a lucide icon component by string name (safe fallback). */
function useIcon(name?: string) {
  return useMemo(() => {
    if (!name) return Icons.Circle;
    const lib: Record<string, React.ComponentType<any>> = Icons as any;
    return lib[name] ?? Icons.Circle;
  }, [name]);
}

function ItemIcon({ item }: { item: NavItem }) {
  const Ico = useIcon(item.icon);
  return <Ico className="ecc-link__icon" size={18} strokeWidth={1.75} />;
}

export default function Sidebar() {
  const [location] = useLocation();
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
    document.body.classList.toggle("ecc--sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    <aside className={`ecc-sidebar ${collapsed ? "is-collapsed" : ""}`} data-collapsed={collapsed}>
      <div className="ecc-sidebar__inner">
        <Brand collapsed={collapsed} />
        <nav className="ecc-nav">
          {NAV_SECTIONS.map((section) => (
            <Section
              key={section.label}
              section={section}
              collapsed={collapsed}
              activePath={location}
            />
          ))}
        </nav>
      </div>

      <button
        className="ecc-collapse-ctl"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((v) => !v)}
      >
        {collapsed ? <Icons.ChevronsRight size={18} /> : <Icons.ChevronsLeft size={18} />}
      </button>
    </aside>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  // Vite serves files under /public at the web root.
  const altusLogo = "/brand/altus-logo.png";
  const altusMark = "/brand/altus-mark.png";

  return (
    <div className="ecc-brand">
      <img
        className="ecc-brand__img"
        src={collapsed ? altusMark : altusLogo}
        alt="Altus"
        draggable={false}
      />
    </div>
  );
}

function Section({
  section,
  collapsed,
  activePath,
}: {
  section: NavSection;
  collapsed: boolean;
  activePath: string;
}) {
  return (
    <div className="ecc-section">
      <div className="ecc-section__label">{section.label}</div>
      <ul className="ecc-list">
        {section.items.map((it) => (
          <li key={it.label} className="ecc-list__item">
            {it.children && it.children.length ? (
              <ParentLink item={it} collapsed={collapsed} activePath={activePath} />
            ) : (
              <LeafLink item={it} activePath={activePath} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function isActive(path: string | undefined, activePath: string) {
  if (!path) return false;
  if (path === "/") return activePath === "/" || activePath === "/dashboard";
  // Keep highlight for route and its descendants, but avoid "/" always matching.
  return activePath === path || activePath.startsWith(path + "/");
}

function LeafLink({ item, activePath }: { item: NavItem; activePath: string }) {
  const active = isActive(item.path, activePath);
  return (
    <Link href={item.path || "#"} className={`ecc-link ${active ? "is-active" : ""}`}>
      <ItemIcon item={item} />
      <span className="ecc-link__label">{item.label}</span>
    </Link>
  );
}

function ParentLink({
  item,
  collapsed,
  activePath,
}: {
  item: NavItem;
  collapsed: boolean;
  activePath: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const anyActive = (item.children ?? []).some((c) => isActive(c.path, activePath));
    setOpen(anyActive);
  }, [activePath, item.children]);

  if (collapsed) {
    // Collapsed → show icon only; hover reveals flyout with children.
    return (
      <div className="ecc-parent group">
        <button className="ecc-link is-parent" aria-haspopup="true" aria-expanded="false">
          <ItemIcon item={item} />
          <span className="ecc-link__label">{item.label}</span>
          <Icons.ChevronRight className="ecc-link__chev" size={16} />
        </button>
        <div className="ecc-flyout" role="menu">
          <div className="ecc-flyout__title">
            <ItemIcon item={item} />
            <span>{item.label}</span>
          </div>
          <ul className="ecc-children">
            {(item.children ?? []).map((c) => (
              <li key={c.label}>
                <LeafLink item={c} activePath={activePath} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Expanded → accordion.
  return (
    <div className={`ecc-parent ${open ? "is-open" : ""}`}>
      <button
        className="ecc-link is-parent"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ItemIcon item={item} />
        <span className="ecc-link__label">{item.label}</span>
        <Icons.ChevronDown className="ecc-link__chev" size={16} />
      </button>
      <ul className={`ecc-children ${open ? "is-open" : ""}`}>
        {(item.children ?? []).map((c) => (
          <li key={c.label}>
            <LeafLink item={c} activePath={activePath} />
          </li>
        ))}
      </ul>
    </div>
  );
}

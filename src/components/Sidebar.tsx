import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import type { NavItem, NavSection } from "./layout/navConfig";
import { NAV_SECTIONS } from "./layout/navConfig";

const STORAGE_KEY = "ecc.sidebar.collapsed";

/** Return a lucide icon component by name with a safe fallback. */
function useIcon(name?: string) {
  return useMemo(() => {
    if (!name) return Icons.Circle;
    const lib: any = Icons;
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
    <aside className={`ecc-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="ecc-sidebar__inner">
        <Brand collapsed={collapsed} />
        <nav className="ecc-nav" aria-label="Main navigation">
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
  return (
    <div className="ecc-brand" title="Altus Realty Group">
      <img
        className="ecc-brand__img"
        src={collapsed ? "/brand/altus-mark.png" : "/brand/altus-logo.png"}
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
            {it.children?.length ? (
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

function LeafLink({ item, activePath }: { item: NavItem; activePath: string }) {
  const active = !!item.path && (activePath === item.path || activePath.startsWith(item.path + "/"));
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
  const [open, setOpen] = useState(false);

  // Open a parent when one of its children is active
  useEffect(() => {
    const hit = (item.children ?? []).some(
      (c) => !!c.path && (activePath === c.path || activePath.startsWith(c.path + "/"))
    );
    setOpen(hit);
  }, [activePath, item.children]);

  if (collapsed) {
    // Collapsed: icon button + hover flyout
    return (
      <div className="ecc-parent">
        <button className="ecc-link is-parent" aria-haspopup="true" title={item.label}>
          <ItemIcon item={item} />
          <span className="ecc-link__label">{item.label}</span>
          <Icons.ChevronRight className="ecc-link__chev" size={16} />
        </button>

        <div className="ecc-flyout">
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

  // Expanded: accordion
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

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import type { NavItem, NavSection } from "../config/navigation";
import { NAV_SECTIONS } from "../config/navigation";
import { useBadgeCounts } from "../state/badges";

const STORAGE_KEY = "ecc.sidebar.collapsed";

/** Resolve a lucide icon safely by name */
function useIcon(name?: string) {
  return useMemo(() => {
    if (!name) return Icons.Circle;
    const lib: any = Icons;
    return lib[name] ?? Icons.Circle;
  }, [name]);
}

function ItemIcon({ item, kind = "child" as "parent" | "child" }) {
  const Ico = useIcon(item.icon);
  return (
    <Ico
      className={`ecc-link__icon ${kind === "parent" ? "is-parent" : "is-child"}`}
      size={18}
      strokeWidth={1.75}
    />
  );
}

function Badge({ value }: { value?: number }) {
  if (!value || value <= 0) return null;
  return <span className="ecc-badge">{value}</span>;
}

export default function Sidebar() {
  const [location] = useLocation();
  const counts = useBadgeCounts();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  // apply body class immediately and whenever it changes
  useEffect(() => {
    try {
      document.body.classList.toggle("ecc--sidebar-collapsed", collapsed);
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <aside className={`ecc-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="ecc-sidebar__inner">
        <Brand collapsed={collapsed} />
        <nav className="ecc-nav">
          {NAV_SECTIONS.map((section) => (
            <Section
              key={section.label}
              section={section}
              collapsed={collapsed}
              activePath={location}
              counts={counts}
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
    <div className="ecc-brand">
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
  counts,
}: {
  section: NavSection;
  collapsed: boolean;
  activePath: string;
  counts: Record<string, number | undefined>;
}) {
  return (
    <div className="ecc-section">
      <div className="ecc-section__label">{section.label}</div>
      <ul className="ecc-list">
        {section.items.map((it) => (
          <li key={it.label} className="ecc-list__item">
            {it.children && it.children.length ? (
              <ParentLink item={it} collapsed={collapsed} activePath={activePath} counts={counts} />
            ) : (
              <LeafLink item={it} activePath={activePath} count={counts[it.badgeKey ?? ""]} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeafLink({
  item,
  activePath,
  count,
}: {
  item: NavItem;
  activePath: string;
  count?: number;
}) {
  const active = !!(item.path && activePath.startsWith(item.path));
  return (
    <Link href={item.path || "#"} className={`ecc-link ${active ? "is-active" : ""}`}>
      <ItemIcon item={item} />
      <span className="ecc-link__label">{item.label}</span>
      <Badge value={count} />
    </Link>
  );
}

function ParentLink({
  item,
  collapsed,
  activePath,
  counts,
}: {
  item: NavItem;
  collapsed: boolean;
  activePath: string;
  counts: Record<string, number | undefined>;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const anyActive = (item.children ?? []).some(
      (c) => c.path && activePath.startsWith(c.path)
    );
    setOpen(anyActive);
  }, [activePath, item.children]);

  const parentCount =
    (item.children ?? [])
      .map((c) => (c.badgeKey ? counts[c.badgeKey] ?? 0 : 0))
      .reduce((a, b) => a + b, 0) || undefined;

  if (collapsed) {
    return (
      <div className="ecc-parent group">
        <button className="ecc-link is-parent" aria-haspopup="true" type="button">
          <ItemIcon item={item} />
          <span className="ecc-link__label">{item.label}</span>
          <Badge value={parentCount} />
          <Icons.ChevronRight className="ecc-link__chev" size={16} />
        </button>
        <div className="ecc-flyout" role="menu">
          <div className="ecc-flyout__title">
            <ItemIcon item={item} />
            <span>{item.label}</span>
            <Badge value={parentCount} />
          </div>
          <ul className="ecc-children">
            {(item.children ?? []).map((c) => (
              <li key={c.label}>
                <LeafLink item={c} activePath={activePath} count={c.badgeKey ? counts[c.badgeKey] : undefined} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`ecc-parent ${open ? "is-open" : ""}`}>
      <button
        className="ecc-link is-parent"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <ItemIcon item={item} />
        <span className="ecc-link__label">{item.label}</span>
        <Badge value={parentCount} />
        <Icons.ChevronDown className="ecc-link__chev" size={16} />
      </button>
      <ul className={`ecc-children ${open ? "is-open" : ""}`}>
        {(item.children ?? []).map((c) => (
          <li key={c.label}>
            <LeafLink item={c} activePath={activePath} count={c.badgeKey ? counts[c.badgeKey] : undefined} />
          </li>
        ))}
      </ul>
    </div>
  );
}

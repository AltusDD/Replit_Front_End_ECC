
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Lucide from "lucide-react";

/* ——— Local types ——— */
type Leaf = { label: string; to: string; icon: string };
type Group = { label: string; icon: string; children: Leaf[] };
type Item = Leaf | Group;
type Section = { title?: string; items: Item[] };

function isGroup(i: Item): i is Group {
  return i && (i as Group).children && Array.isArray((i as Group).children);
}

/* ——— Import nav config robustly (avoid .length on undefined) ——— */
import * as Nav from "@/components/layout/navConfig";
const RAW_SECTIONS: unknown =
  (Nav as any)?.sections ?? (Nav as any)?.default ?? [];

const DEFAULT_SECTIONS: Section[] = [
  { title: "Primary", items: [{ label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" }] },
];

const SECTIONS: Section[] = Array.isArray(RAW_SECTIONS) && RAW_SECTIONS.length
  ? (RAW_SECTIONS as Section[])
  : DEFAULT_SECTIONS;

/* ——— Icon resolver ——— */
const getIcon = (name?: string) => {
  const Comp = (Lucide as any)?.[name || ""] || Lucide.CircleDot;
  return Comp as React.ComponentType<{ size?: number }>;
};

export default function Sidebar() {
  const [location] = useLocation();
  const current = location || "/";

  /* Stable hook order: ALL hooks declared top-level, never inside conditions */

  // collapsed state with persistence
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("ecc:nav:collapsed") === "1"; } catch { return false; }
  });

  // persist collapsed + set global padding var + mount flag
  useEffect(() => {
    try { localStorage.setItem("ecc:nav:collapsed", collapsed ? "1" : "0"); } catch {}
    const root = document.documentElement;
    const pad = collapsed ? "var(--ecc-sidebar-w-collapsed)" : "var(--ecc-sidebar-w)";
    root.style.setProperty("--ecc-sidepad", pad);
    root.setAttribute("data-sidebar-mounted", "1");
    return () => {
      // keep the attribute; removed only when component unmounts
      root.setAttribute("data-sidebar-mounted", "1");
    };
  }, [collapsed]);

  // hover/flyout state
  const [hovering, setHovering] = useState(false);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  // compute which groups should be open based on active route
  const initialExpanded = useMemo(() => {
    const map = new Map<string, boolean>();
    SECTIONS.forEach((section, sIdx) => {
      (section.items || []).forEach((it, iIdx) => {
        if (isGroup(it)) {
          const open = (it.children || []).some((c) => current.startsWith(c.to));
          map.set(`${sIdx}:${iIdx}`, open);
        }
      });
    });
    return map;
  }, [current]);

  // expanded state synced to initialExpanded
  const [expanded, setExpanded] = useState<Map<string, boolean>>(initialExpanded);
  useEffect(() => setExpanded(initialExpanded), [initialExpanded]);

  const toggle = (key: string) =>
    setExpanded((prev) => new Map(prev).set(key, !prev.get(key)));

  const PinIcon = collapsed ? Lucide.PinOff : Lucide.Pin;

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      aria-label="Primary Navigation"
      onMouseEnter={() => collapsed && setHovering(true)}
      onMouseLeave={() => collapsed && setHovering(false)}
    >
      {/* Brand */}
      <div className="brand">
        <img
          src="/logo.png"
          alt="Altus Realty Group"
          className="brand-logo"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Controls (pin) */}
      <div className="nav-controls">
        {!collapsed && (
          <button className="pinBtn" onClick={() => setCollapsed((v) => !v)} title={collapsed ? "Unpin" : "Collapse"}>
            <PinIcon size={16} />
            <span>{collapsed ? " Unpin" : " Collapse"}</span>
          </button>
        )}
      </div>

      {/* Scrollable nav */}
      <div className="sidebar-scroll">
        <nav role="navigation" aria-label="Main">
          {SECTIONS.map((section, sIdx) => (
            <div className="section" key={section.title || sIdx}>
              {section.title && <div className="section-title">{section.title}</div>}

              {(section.items || []).map((it, iIdx) => {
                const key = `${sIdx}:${iIdx}`;

                if (isGroup(it)) {
                  const open = expanded.get(key) ?? false;
                  const ParentIcon = getIcon(it.icon);
                  return (
                    <div className="group" key={key}>
                      <button
                        type="button"
                        className={`nav-row group-row ${open ? "open" : ""}`}
                        aria-expanded={open}
                        onClick={() => toggle(key)}
                      >
                        <span className="icon parent"><ParentIcon size={18} /></span>
                        <span className="label">{it.label}</span>
                        <Lucide.ChevronDown className="expand" size={16} />
                      </button>

                      <div className="leafList" hidden={!open}>
                        {(it.children || []).map((ch) => {
                          const active = current.startsWith(ch.to);
                          const ChildIcon = getIcon(ch.icon);
                          return (
                            <Link
                              key={ch.to}
                              href={ch.to}
                              className={`nav-row leaf ${active ? "active" : ""}`}
                              aria-current={active ? "page" : undefined}
                            >
                              <span className="icon child"><ChildIcon size={18} /></span>
                              <span className="label">{ch.label}</span>
                              <span className="expand" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // plain leaf
                const leaf = it as Leaf;
                const active = current.startsWith(leaf.to);
                const LeafIcon = getIcon(leaf.icon);
                return (
                  <Link
                    key={leaf.to}
                    href={leaf.to}
                    className={`nav-row leaf ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="icon child"><LeafIcon size={18} /></span>
                    <span className="label">{leaf.label}</span>
                    <span className="expand" />
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Expand button for collapsed sidebar */}
      {collapsed && (
        <button
          className="railExpand"
          onClick={() => setCollapsed(false)}
          title="Expand"
          aria-label="Expand navigation"
        >
          <Lucide.ChevronRight size={18} />
        </button>
      )}
      
      {/* Collapsed hover flyout */}
      {collapsed && (
        <div className={`flyout ${hovering ? "show" : ""}`} aria-hidden={!hovering} ref={flyoutRef}>
          <div className="flyout-header">
            <img src="/logo.png" alt="Altus" />
          </div>
          <div className="flyout-body">
            {SECTIONS.map((section, sIdx) => (
              <div className="flyout-section" key={section.title || sIdx}>
                {section.title && <div className="flyout-title">{section.title}</div>}
                {(section.items || []).map((it, iIdx) => {
                  if (isGroup(it)) {
                    const ParentIcon = getIcon(it.icon);
                    return (
                      <div className="flyout-group" key={`${sIdx}:${iIdx}`}>
                        <div className="flyout-parent">
                          <span className="icon parent"><ParentIcon size={18} /></span>
                          <span className="label">{it.label}</span>
                        </div>
                        <div className="flyout-children">
                          {(it.children || []).map((ch) => {
                            const ChildIcon = getIcon(ch.icon);
                            const active = current.startsWith(ch.to);
                            return (
                              <Link key={ch.to} href={ch.to} className={`flyout-leaf ${active ? "active" : ""}`}>
                                <span className="icon child"><ChildIcon size={16} /></span>
                                <span className="label">{ch.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  const leaf = it as Leaf;
                  const LeafIcon = getIcon(leaf.icon);
                  const active = current.startsWith(leaf.to);
                  return (
                    <Link key={leaf.to} href={leaf.to} className={`flyout-leaf ${active ? "active" : ""}`}>
                      <span className="icon child"><LeafIcon size={16} /></span>
                      <span className="label">{leaf.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    {/* ——— Local, sidebar-scoped overrides to beat global/visited rules ——— */}
    <style
      // loads after global CSS; scoped to .sidebar; safe & surgical
      dangerouslySetInnerHTML={{
        __html: `
        /* kill purple visited links & any theme link colors inside sidebar */
        .sidebar a,
        .sidebar a:link,
        .sidebar a:visited,
        .sidebar a:active,
        .sidebar .nav-row,
        .sidebar .nav-row:visited {
          color: var(--ecc-text) !important;
          text-decoration: none !important;
        }

        /* collapsed = icon-only */
        .sidebar.collapsed .section-title,
        .sidebar.collapsed .label,
        .sidebar.collapsed .expand {
          display: none !important;
        }

        /* highest specificity so icons keep our colors */
        .sidebar .nav-row .icon.parent { color: var(--ecc-gold) !important; }
        .sidebar .nav-row .icon.child  { color: var(--ecc-dim) !important; }
        .sidebar .flyout .icon.parent  { color: var(--ecc-gold) !important; }
        .sidebar .flyout .icon.child   { color: var(--ecc-dim)  !important; }

        /* fly-out always bounded */
        .sidebar .flyout { max-width: var(--ecc-flyout-w, 280px) !important; }
      `,
      }}
    />

    </aside>
  );
}

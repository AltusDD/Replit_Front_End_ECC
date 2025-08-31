
// src/components/Sidebar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

// icons
import * as Lucide from "lucide-react";

/* Local types (keep file self-contained) */
type Leaf = { label: string; to: string; icon: string };
type Group = { label: string; icon: string; children: Leaf[] };
type Item = Leaf | Group;
type Section = { title?: string; items: Item[] };
function isGroup(i: Item): i is Group {
  // @ts-ignore
  return i && (i as Group).children && Array.isArray((i as Group).children);
}

/* Import nav config (robust) */
import * as Nav from "@/components/layout/navConfig";
const RAW: any =
  (Nav as any).sections ??
  (Nav as any).default ??
  (Array.isArray(Nav) ? Nav : []);

const SECTIONS: Section[] = Array.isArray(RAW) && RAW.length ? RAW : [
  { title: "Primary", items: [{ label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" }] },
];

/* Util: map icon string -> component */
const getIcon = (name?: string) => {
  const key = (name || "").trim();
  const Comp = (Lucide as any)[key] || Lucide.CircleDot;
  return Comp as React.ComponentType<any>;
};

export default function Sidebar() {
  const [location] = useLocation();
  const current = location || "/";

  // collapsed & hover flyout state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("ecc:nav:collapsed") === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("ecc:nav:collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const [hovering, setHovering] = useState(false);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  // auto-open groups containing the active child
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

  const [expanded, setExpanded] = useState(initialExpanded);
  useEffect(() => setExpanded(initialExpanded), [initialExpanded]);

  const toggle = (key: string) =>
    setExpanded((prev) => new Map(prev).set(key, !prev.get(key)));

  // sticky pin button: hide when collapsed
  const PinIcon = collapsed ? Lucide.PinOff : Lucide.Pin;

  // close flyout if we leave sidebar area entirely
  useEffect(() => {
    const onDocMove = (e: MouseEvent) => {
      if (!flyoutRef.current) return;
      if (!flyoutRef.current.contains(e.target as Node)) {
        // let hovering be driven by sidebar container's mouseenter/leave
      }
    };
    document.addEventListener("mousemove", onDocMove);
    return () => document.removeEventListener("mousemove", onDocMove);
  }, []);

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      data-role="sidebar"
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

      {/* Nav controls (pin) */}
      <div className="nav-controls">
        {!collapsed && (
          <button className="pinBtn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Unpin" : "Pin"}>
            <PinIcon size={16} />
            <span> {collapsed ? "Unpin" : "Collapse"}</span>
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

                // leaf
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

      {/* Collapsed hover flyout */}
      {collapsed && (
        <div
          ref={flyoutRef}
          className={`flyout ${hovering ? "show" : ""}`}
          aria-hidden={!hovering}
        >
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
                              <Link
                                key={ch.to}
                                href={ch.to}
                                className={`flyout-leaf ${active ? "active" : ""}`}
                              >
                                <span className="icon child"><ChildIcon size={16} /></span>
                                <span className="label">{ch.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  // single leaf in flyout
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
    </aside>
  );
}

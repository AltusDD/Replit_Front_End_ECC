// src/components/Sidebar.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

/* ——— Types (kept local so this file is self-contained) ——— */
type Leaf = { label: string; to: string };
type Group = { label: string; children: Leaf[] };
type Item = Leaf | Group;
type Section = { title?: string; items: Item[] };

function isGroup(i: Item): i is Group {
  return (i as Group)?.children !== undefined;
}

/* ——— Import nav config (robust to different export shapes) ——— */
import * as Nav from "./layout/navConfig";
const RAW: any =
  (Nav as any).sections ??
  (Nav as any).default ??
  (Array.isArray(Nav) ? Nav : []);

const DEFAULT_SECTIONS: Section[] = [
  { title: "Dashboard", items: [{ label: "Home", to: "/dashboard" }] },
];

const SECTIONS: Section[] = Array.isArray(RAW) && RAW.length ? RAW : DEFAULT_SECTIONS;

/* ——— Component ——— */
export default function Sidebar() {
  const [location] = useLocation();
  const current = location || "/";

  // Persist collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("ecc:nav:collapsed") === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("ecc:nav:collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  // Auto-open groups that contain the active child
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

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} data-role="sidebar" aria-label="Primary">
      {/* Brand + Pin */}
      <div className="brand">
        <img
          src="/brand/altus-logo.png"
          alt="Altus Realty Group"
          className="brand-logo"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <button className="pinBtn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "Unpin" : "Pin"}
        </button>
      </div>

      {/* Independent scroll (scrollbar hidden by CSS) */}
      <div className="sidebar-scroll">
        <nav role="navigation" data-nav aria-label="Main">
          {SECTIONS.map((section, sIdx) => (
            <div className="section" key={section.title || sIdx}>
              {section.title && <div className="section-title">{section.title}</div>}

              {(section.items || []).map((it, iIdx) => {
                const key = `${sIdx}:${iIdx}`;

                if (isGroup(it)) {
                  const open = expanded.get(key) ?? false;
                  return (
                    <div className="group" key={key}>
                      <button
                        type="button"
                        className="nav-row group-row"
                        aria-expanded={open}
                        onClick={() => toggle(key)}
                      >
                        <span className="icon">•</span>
                        <span className="label">{it.label}</span>
                        <span className="expand" aria-hidden>▾</span>
                      </button>

                      <div className="leafList" hidden={!open}>
                        {(it.children || []).map((ch) => {
                          const active = current.startsWith(ch.to);
                          return (
                            <Link
                              key={ch.to}
                              href={ch.to}
                              className={`nav-row leaf ${active ? "active" : ""}`}
                              aria-current={active ? "page" : undefined}
                            >
                              <span className="icon">•</span>
                              <span className="label">{ch.label}</span>
                              <span className="expand" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Leaf
                const leaf = it as Leaf;
                const active = current.startsWith(leaf.to);
                return (
                  <Link
                    key={leaf.to}
                    href={leaf.to}
                    className={`nav-row leaf ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="icon">•</span>
                    <span className="label">{leaf.label}</span>
                    <span className="expand" />
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
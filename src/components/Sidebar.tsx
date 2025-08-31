
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

type Leaf = { label: string; to: string };
type Group = { label?: string; children: Leaf[] };
type Item = Leaf | Group;
type Section = { title?: string; items: Item[] };
const isGroup = (i: Item): i is Group => (i as Group)?.children !== undefined;

import * as Nav from "@/components/layout/navConfig";
const RAW: any = (Nav as any).sections ?? (Nav as any).default ?? [];
const DEFAULT_SECTIONS: Section[] = [{ title: "Dashboard", items: [{ label: "Home", to: "/dashboard" }] }];
const SECTIONS: Section[] = Array.isArray(RAW) && RAW.length ? RAW : DEFAULT_SECTIONS;

export default function Sidebar() {
  const [location] = useLocation();
  const current = location || "/";

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("ecc:nav:collapsed") === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("ecc:nav:collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  // reserve body space so content never slides under the rail
  useEffect(() => {
    document.documentElement.setAttribute("data-sidebar-mounted", "1");
    const w = getComputedStyle(document.documentElement).getPropertyValue("--ecc-sidebar-w").trim() || "280px";
    const wc = getComputedStyle(document.documentElement).getPropertyValue("--ecc-sidebar-w-collapsed").trim() || "76px";
    document.documentElement.style.setProperty("--ecc-sidepad", collapsed ? wc : w);
  }, [collapsed]);

  const initialExpanded = useMemo(() => {
    const map = new Map<string, boolean>();
    SECTIONS.forEach((section, s) => {
      (section.items || []).forEach((it, i) => {
        if (isGroup(it)) {
          const open = (it.children || []).some((c) => current.startsWith(c.to));
          map.set(`${s}:${i}`, open);
        }
      });
    });
    return map;
  }, [current]);
  const [expanded, setExpanded] = useState(initialExpanded);
  useEffect(() => setExpanded(initialExpanded), [initialExpanded]);

  const toggle = (k: string) => setExpanded((p) => new Map(p).set(k, !p.get(k)));

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} data-ecc="primary" aria-label="Primary">
      <div className="brand">
        <img src="/logo.png" alt="Altus" className="brand-logo" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        <button className="pinBtn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "Unpin" : "Pin"}</button>
      </div>

      <div className="sidebar-scroll">
        <nav role="navigation" aria-label="Main">
          {SECTIONS.map((section, sIdx) => (
            <div className="section" key={section.title || sIdx}>
              {section.title && <div className="section-title">{section.title}</div>}
              {(section.items || []).map((it, iIdx) => {
                const key = `${sIdx}:${iIdx}`;
                if (isGroup(it)) {
                  const open = expanded.get(key) ?? false;
                  return (
                    <div className="group" key={key}>
                      <button type="button" className="nav-row group-row" aria-expanded={open} onClick={() => toggle(key)}>
                        <span className="icon">•</span>
                        <span className="label">{(it as any).label ?? "Group"}</span>
                        <span className="expand" aria-hidden>▾</span>
                      </button>
                      <div className="leafList" hidden={!open}>
                        {(it.children || []).map((ch) => {
                          const active = current.startsWith(ch.to);
                          return (
                            <Link key={ch.to} href={ch.to} className={`nav-row leaf ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
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
                const leaf = it as Leaf;
                const active = current.startsWith(leaf.to);
                return (
                  <Link key={leaf.to} href={leaf.to} className={`nav-row leaf ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
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

      {/* visited-link kill inside sidebar only */}
      <style>{`
        .sidebar[data-ecc="primary"] a,
        .sidebar[data-ecc="primary"] a:link,
        .sidebar[data-ecc="primary"] a:visited,
        .sidebar[data-ecc="primary"] a:active { color: var(--ecc-text) !important; text-decoration: none !important; }
      `}</style>
    </aside>
  );
}

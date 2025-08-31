import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

/** Get current path safely, even if Sidebar is rendered outside <Router> */
function useSafePath() {
  try {
    // Will throw if no Router context:
    const loc = useLocation();
    return loc.pathname;
  } catch {
    return typeof window !== "undefined" ? window.location.pathname : "/";
  }
}

/** Simple helper to check "active" by prefix */
function isActive(path: string, href: string) {
  if (!href || href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}

/** Nav model (edit labels/paths here if you need to) */
const NAV = [
  {
    title: "Dashboard",
    items: [{ label: "Home", to: "/dashboard" }],
  },
  {
    title: "Portfolio V3",
    items: [
      { label: "Properties", to: "/portfolio/properties" },
      { label: "Units", to: "/portfolio/units" },
      { label: "Leases", to: "/portfolio/leases" },
      { label: "Tenants", to: "/portfolio/tenants" },
      { label: "Owners", to: "/portfolio/owners" },
    ],
  },
  {
    title: "Cards",
    items: [
      { label: "Overview", to: "/cards/overview" },
      { label: "Delinquencies", to: "/cards/delinquencies" },
      { label: "Vacancy", to: "/cards/vacancy" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Accounting", to: "/ops/accounting" },
      { label: "Leasing", to: "/ops/leasing" },
      { label: "Maintenance", to: "/ops/maintenance" },
      { label: "Marketing", to: "/ops/marketing" },
    ],
  },
];

export default function Sidebar() {
  const path = useSafePath();
  // wouter adapter: keep old `loc.pathname` logic working
  const [pathname] = useLocation();
  const loc = { pathname };

  // collapsed state persisted
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
      // also flip app-shell grid
      const shell = document.querySelector(".app-shell");
      if (shell) shell.classList.toggle("collapsed", collapsed);
    } catch {}
  }, [collapsed]);

  // which groups are expanded (persist, but default to true)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem("ecc:nav:open");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("ecc:nav:open", JSON.stringify(openGroups));
    } catch {}
  }, [openGroups]);

  // mark groups that contain current route (used to show child icons when collapsed)
  const currentGroupIndex = useMemo(() => {
    return NAV.findIndex((g) => g.items.some((it) => isActive(path, it.to)));
  }, [path]);

  const toggleGroup = (idx: number) =>
    setOpenGroups((p) => ({ ...p, [idx]: !p[idx] }));

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      data-role="sidebar"
      aria-label="Primary"
    >
      {/* Brand */}
      <div className="brand">
        {/* Put your logo asset in /public if needed; the class handles sizing */}
        <img
          className="brand-logo"
          src="/brand/altus-logo.png"
          alt="Altus Realty Group"
        />
        {/* Pin/Unpin lives here so it stays near the brand; hidden in collapsed */}
        <button
          className="pinBtn hide-when-collapsed"
          onClick={() => setCollapsed((v) => !v)}
          aria-pressed={collapsed ? "true" : "false"}
        >
          {collapsed ? "Unpin" : "Pin"}
        </button>
      </div>

      {/* Scroll container */}
      <div className="sidebar-scroll" role="navigation" data-nav>
        {NAV.map((group, idx) => {
          const expanded = openGroups[idx] ?? true;
          const hasCurrentChild = idx === currentGroupIndex;

          return (
            <div key={group.title}>
              <div
                className="section-title"
                aria-label={`${group.title} section`}
              >
                {group.title}
              </div>

              {/* Group header row (click to expand/collapse) */}
              <div
                className="nav-row group-row"
                role="button"
                aria-expanded={expanded ? "true" : "false"}
                data-current-child={hasCurrentChild ? "true" : "false"}
                onClick={() => toggleGroup(idx)}
              >
                <span className="icon">•</span>
                <span className="label">{group.title}</span>
                <span className="chev">›</span>
              </div>

              {/* Children */}
              {expanded && (
                <div className="leafList">
                  {group.items.map((it) => {
                    const active = isActive(path, it.to);
                    const El: any = Link ?? "a"; // fallback if router absent
                    const common = (
                      <>
                        <span className="icon bullet">•</span>
                        <span className="label">{it.label}</span>
                      </>
                    );
                    return (
                      <El
                        key={it.to}
  href={it.to}
                        className={`nav-row leaf ${active ? "active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {common}
                      </El>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer (kept simple) */}
      <div className="sidebar-footer">
        <button
          className="pinBtn"
          onClick={() => setCollapsed((v) => !v)}
          aria-pressed={collapsed ? "true" : "false"}
        >
          {collapsed ? "Unpin" : "Pin"}
        </button>
      </div>
    </aside>
  );
}

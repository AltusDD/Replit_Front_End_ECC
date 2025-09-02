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
})

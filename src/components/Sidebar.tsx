import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import NAV, { Section, Group, Leaf } from "@/lib/navConfig";
import {
  Home, Building2, Layers, KeyRound, Users, User, Settings, Folder,
  FileText, Calculator, TrendingUp, Database, PieChart, Zap, Wrench,
  ChevronDown, ChevronRight
} from "lucide-react";

const iconMap: Record<string, any> = {
  dashboard: Home,
  home: Home,
  portfolio: Building2,
  properties: Building2,
  units: Layers,
  leases: KeyRound,
  tenants: Users,
  owners: User,
  cards: FileText,
  operations: Calculator,
  accounting: Calculator,
  leasing: KeyRound,
  maintenance: Wrench,
  compliance: FileText,
  vendors: Users,
  growth: TrendingUp,
  system: Settings,
  settings: Settings,
  data: Database,
  investor: PieChart,
  integrations: Zap,
  tools: Wrench,
};

const iconFor = (label: string) => {
  const key = label.toLowerCase();
  for (const k in iconMap) if (key.includes(k)) return iconMap[k];
  return Folder;
};

export default function Sidebar() {
  const [isCollapsed, setCollapsed] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [loc] = useLocation();

  const collapsed = isCollapsed && !hoverExpand;

  // Ensure parent stays open if user selected a child
  useEffect(() => {
    const activeItem = NAV
      .flatMap(sec => sec.groups)
      .find(grp => grp.items.some(item => item.path === loc));
    if (activeItem) {
      setOpenGroups(prev => new Set([...prev, activeItem.label]));
    }
  }, [loc]);

  useEffect(() => {
    const icon = document.querySelector(".nav-icon svg");
    if (icon instanceof HTMLElement) {
      const iconW = icon.offsetWidth + 24;
      document.documentElement.style.setProperty("--collapsed-width", `${iconW}px`);
      document.documentElement.style.setProperty("--collapsed-logo", `${iconW * 0.8}px`);
    }
  }, [collapsed]);

  const toggleGroup = (groupLabel: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupLabel)) {
      newOpenGroups.delete(groupLabel);
    } else {
      newOpenGroups.add(groupLabel);
    }
    setOpenGroups(newOpenGroups);
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
    >
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <nav className="nav">
        {NAV.map((section: Section) => (
          <div key={section.label} className="nav-section">
            {!collapsed && <div className="nav-title">{section.label}</div>}
            {section.groups.map((group: Group) => (
              <div key={group.label} className="group">
                <button
                  className="groupBtn"
                  onClick={() => toggleGroup(group.label)}
                >
                  <div className="nav-icon">
                    {(() => {
                      const Icon = iconFor(group.label);
                      return <Icon size={18} color="#F7C948" />;
                    })()}
                  </div>
                  {!collapsed && (
                    <>
                      <span className="lbl">{group.label}</span>
                      <div className="expand-icon">
                        {openGroups.has(group.label) ? 
                          <ChevronDown size={14} /> : 
                          <ChevronRight size={14} />
                        }
                      </div>
                    </>
                  )}
                </button>
                {openGroups.has(group.label) && (
                  <div className="leafList">
                    {group.items.map((leaf: Leaf) => (
                      <Link
                        key={leaf.label}
                        href={leaf.path}
                        className={`leaf-item ${loc === leaf.path ? "active" : ""}`}
                      >
                        {!collapsed && <span className="leaf-label">{leaf.label}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="pinBtn" onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? "Unpin" : "Pin"}
        </button>
      </div>
    </aside>
  );
}
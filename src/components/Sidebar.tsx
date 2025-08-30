import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import navConfig from "@/lib/navConfig";
import {
  Home, Building2, Layers, KeyRound, Users, User, Settings, Folder,
} from "lucide-react";

const iconMap: Record<string, any> = {
  dashboard: Home,
  properties: Building2,
  units: Layers,
  leases: KeyRound,
  tenants: Users,
  owners: User,
  settings: Settings,
};

const iconFor = (label: string) => {
  const key = label.toLowerCase();
  for (const k in iconMap) if (key.includes(k)) return iconMap[k];
  return Folder;
};

export default function Sidebar() {
  const [isCollapsed, setCollapsed] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [loc] = useLocation();

  const collapsed = isCollapsed && !hoverExpand;

  useEffect(() => {
    const icon = document.querySelector(".nav-icon svg");
    if (icon instanceof HTMLElement) {
      const iconW = icon.offsetWidth + 24;
      document.documentElement.style.setProperty("--collapsed-width", `${iconW}px`);
      document.documentElement.style.setProperty("--collapsed-logo", `${iconW * 0.8}px`);
    }
  }, [collapsed]);

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
        {navConfig.map((sec: any, i: number) => (
          <div key={i} className="nav-section">
            <div className="nav-title">{!collapsed && sec.label}</div>
            {sec.items.map((item: any) => {
              const Icon = iconFor(item.label);
              const active = loc === item.path;
              return (
                <Link href={item.path} key={item.label} className={`nav-item ${active ? "active" : ""}`}>
                  <Icon className="nav-icon" size={18} color="#F7C948" />
                  {!collapsed && <span className="lbl">{item.label}</span>}
                </Link>
              );
            })}
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
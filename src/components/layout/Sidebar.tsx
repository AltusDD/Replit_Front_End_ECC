import React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutGrid, Boxes, FileText, Shield, Scale, MessageSquare,
  Hammer, BarChart3, PieChart, Settings, Database, Link2, ChevronRight, Pin,
  Building, Grid3x3, FileSignature, Users, IdCard, Receipt, CreditCard, BookText,
  Presentation, Bot, History
} from "lucide-react";

import { NAV_SECTIONS as NAV, orderedNav } from "@/config/navigation";
import "./sidebar.css";

// --- icon mapping (single source) ---
const ICONS: Record<string, React.ElementType> = {
  Dashboard: LayoutGrid,
  Portfolio: Boxes,
  Accounting: FileText,
  "AI Analytics": Shield,
  "Legal Tracker": Scale,
  Communication: MessageSquare,
  "Construction & Repair": Hammer,
  Reports: BarChart3,
  Growth: PieChart,
  System: Settings,
  "Data Management": Database,
  "Investor Portal": PieChart,
  Integrations: Link2,

  // common children (extend as needed)
  Properties: Building, Units: Grid3x3, Leases: FileSignature, Tenants: Users, Owners: IdCard,
  "Financial Reports": BookText, "Collections Log": History, "Payment Plans": CreditCard, Deposits: Receipt,
};

// helper
const Icon = ({ name, className }: { name?: string; className?: string }) => {
  const Cmp = (name && ICONS[name]) || FileText;
  return <Cmp className={className} data-icon={name || "FileText"} />;
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(() => localStorage.getItem("sidebarCollapsed")==="true");
  React.useEffect(()=>localStorage.setItem("sidebarCollapsed", String(isCollapsed)),[isCollapsed]);
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [fly, setFly] = React.useState<{key:string; x:number; y:number} | null>(null);
  const [pathname] = useLocation();

  const toggle = (key: string) => setOpenKey(prev => prev===key ? null : key);

  // flyout timers to prevent flicker
  const flyTimer = React.useRef<number | null>(null);
  const showFly = (key:string, e:React.MouseEvent) => {
    if(!isCollapsed) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (flyTimer.current) window.clearTimeout(flyTimer.current);
    flyTimer.current = window.setTimeout(() => setFly({key, x: rect.right+8, y: rect.top}), 100);
  };
  const hideFly = () => {
    if (flyTimer.current) window.clearTimeout(flyTimer.current);
    flyTimer.current = window.setTimeout(() => setFly(null), 120);
  };

  // Group navigation by section
  const sections = [
    "Dashboard", "Portfolio", "Operations", "Growth", 
    "System", "Data Management", "Investor Portal", "Integrations"
  ];
  
  const groupedNavigation = sections.map(sectionName => ({
    title: sectionName,
    items: orderedNav(NAV.filter(item => item.meta?.section === sectionName))
  }));

  return (
    <aside className={`ecc-sidebar ${isCollapsed ? "is-collapsed":""}`}>
      {/* Brand */}
      <div className="ecc-brand" data-icon="brand">
        {isCollapsed ? (
          <img src="/brand/altus-mark.png" alt="Altus" className="ecc-brand__mark logoMark" data-icon="logoMark" />
        ) : (
          <img src="/brand/altus-wordmark.png" alt="Altus Realty Group" className="ecc-brand__full logoFull" data-icon="logoFull" />
        )}
      </div>

      {/* Groups (titles are your required section headings) */}
      {groupedNavigation.map(group => (
        <div className="nav-group" key={group.title} data-icon={`section-${group.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="nav-group__title" data-icon={`title-${group.title.toLowerCase().replace(/\s+/g, '-')}`}>{group.title}</div>

          {group.items.map(item => {
            const isDash = item.label === "Dashboard";
            const active = pathname === (isDash ? "/dashboard" : "");

            const parentRow = (
              <div
                className={`nav-item nav-item--parent ${active ? "active":""}`}
                onClick={() => toggle(item.label)}
                onMouseEnter={(e)=> showFly(item.label, e)}
                onMouseLeave={hideFly}
                aria-expanded={openKey === item.label}
              >
                <Icon name={item.label} className="nav-item__icon" />
                {!isCollapsed && <span className="nav-item__label" data-icon="label">{item.label}</span>}
                {!isDash && <ChevronRight className="nav-item__chev" data-icon="chevron" />}
              </div>
            );

            // Dashboard: direct link, no chevron
            if (isDash) {
              return (
                <Link href="/dashboard" key={item.label} className="nav-item nav-item--parent nav-item--dashboard" data-icon="dashboard-link">
                  <Icon name={item.label} className="nav-item__icon" />
                  {!isCollapsed && <span className="nav-item__label" data-icon="dashboard-label">{item.label}</span>}
                </Link>
              );
            }

            return (
              <div key={item.label}>
                {parentRow}

                {/* Expanded children */}
                {!isCollapsed && openKey === item.label && item.children?.map(ch => {
                  const chActive = pathname === ch.path;
                  return (
                    <Link href={ch.path} key={ch.label} className={`nav-item nav-item--child ${chActive ? "active":""}`}>
                      <Icon name={ch.label} className="nav-item__icon" />
                      <span className="nav-item__label">{ch.label}</span>
                    </Link>
                  );
                })}

                {/* Collapsed flyout */}
                {isCollapsed && fly?.key === item.label && item.children?.length ? (
                  <div className="ecc-fly" style={{left: fly.x, top: fly.y}} onMouseEnter={()=>{ if(flyTimer.current) window.clearTimeout(flyTimer.current);} } onMouseLeave={hideFly}>
                    <div className="ecc-fly__title">{item.label}</div>
                    <ul>
                      {item.children.map(ch => (
                        <li key={ch.label}>
                          <Link href={ch.path}>
                            <Icon name={ch.label} className="nav-item__icon" />
                            <span className="nav-item__label">{ch.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ): null}
              </div>
            );
          })}
        </div>
      ))}

      {/* Pin at bottom (no pill overlay) */}
      <button className="ecc-pin" data-testid="nav-pin" aria-label="Pin sidebar" onClick={()=>setIsCollapsed(v=>!v)}>
        <Pin size={18}/>
      </button>
    </aside>
  );
}
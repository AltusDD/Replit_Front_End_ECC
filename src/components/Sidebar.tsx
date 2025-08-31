import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import sections, { Section, Item, Leaf } from "./layout/navConfig";

// Fallback sections logic
const DEFAULT_SECTIONS: Section[] = [
  { title: "Dashboard", items: [{ label: "Home", to: "/dashboard", icon: "LayoutDashboard" }] },
];

const SECTIONS: Section[] = Array.isArray(sections) && sections.length ? sections : DEFAULT_SECTIONS;

// Dynamic icon component
const DynamicIcon = ({ name, className = "", size = 18 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <Icons.Circle size={size} className={className} />;
};

export default function Sidebar() {
  const [location] = useLocation();
  
  // Collapsed state persisted to localStorage
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

  // Group expanded state - auto-expand if current location matches a child
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    
    // Auto-expand sections that have an active child
    SECTIONS.forEach((section) => {
      if (section.title) {
        const hasActiveChild = section.items.some((item) => {
          if ('to' in item) {
            return location === item.to || location?.startsWith(item.to + "/");
          }
          return false;
        });
        initialState[section.title] = hasActiveChild;
      }
    });

    try {
      const stored = localStorage.getItem("ecc:nav:expanded");
      const storedState = stored ? JSON.parse(stored) : {};
      return { ...initialState, ...storedState };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ecc:nav:expanded", JSON.stringify(expandedGroups));
    } catch {}
  }, [expandedGroups]);

  // Auto-expand groups when location changes if they have active children
  useEffect(() => {
    const newExpandedState = { ...expandedGroups };
    let hasChanges = false;

    SECTIONS.forEach((section) => {
      if (section.title) {
        const hasActiveChild = section.items.some((item) => {
          if ('to' in item) {
            return location === item.to || location?.startsWith(item.to + "/");
          }
          return false;
        });
        
        if (hasActiveChild && !newExpandedState[section.title]) {
          newExpandedState[section.title] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setExpandedGroups(newExpandedState);
    }
  }, [location]);

  const toggleGroup = (sectionTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActive = (path: string) => {
    if (!location || !path) return false;
    return location === path || location.startsWith(path + "/");
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Hover state for fly-out
  const [hoverSection, setHoverSection] = useState<string | null>(null);

  return (
    <aside 
      className={`sidebar ${collapsed ? "collapsed" : ""}`} 
      data-role="sidebar"
      onMouseLeave={() => setHoverSection(null)}
    >
      <div className="brand">
        <img
          className="brand-logo"
          src="/brand/altus-logo.png"
          alt="Altus Realty Group"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      {/* Pin button next to nav */}
      {!collapsed && (
        <div className="pin-controls">
          <button
            className="pinBtn"
            onClick={toggleCollapse}
            aria-pressed={collapsed ? "true" : "false"}
            aria-label="Collapse sidebar"
          >
            <DynamicIcon name="Pin" size={14} />
          </button>
        </div>
      )}

      <div className="sidebar-scroll">
        <nav role="navigation" data-nav>
          {SECTIONS.map((section) => {
            const isExpanded = expandedGroups[section.title || ""] ?? false;
            const isHovered = hoverSection === section.title && collapsed;
            
            return (
              <div 
                key={section.title} 
                className={`nav-section ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => collapsed && setHoverSection(section.title || null)}
              >
                {section.title && (
                  <div
                    className="section-header"
                    onClick={() => !collapsed && toggleGroup(section.title || "")}
                    role="button"
                    aria-expanded={isExpanded}
                    tabIndex={collapsed ? -1 : 0}
                  >
                    <span className="section-title">{section.title}</span>
                    {!collapsed && (
                      <DynamicIcon 
                        name="ChevronRight" 
                        className={`section-chevron ${isExpanded ? "expanded" : ""}`}
                        size={16}
                      />
                    )}
                  </div>
                )}
                
                {/* Navigation items */}
                <div className={`nav-items ${isExpanded || collapsed ? "visible" : "hidden"}`}>
                  {section.items.map((item) => {
                    // Type guard to ensure we only process leaf items
                    if ('to' in item) {
                      const active = isActive(item.to);
                      
                      return (
                        <Link
                          key={item.to}
                          href={item.to}
                          className={`nav-item ${active ? "active" : ""}`}
                          aria-current={active ? "page" : undefined}
                          onClick={() => collapsed && setHoverSection(null)}
                        >
                          <span className="nav-icon">
                            <DynamicIcon 
                              name={item.icon} 
                              className={active ? "icon-active" : "icon-default"}
                              size={18}
                            />
                          </span>
                          <span className="nav-label">{item.label}</span>
                        </Link>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Fly-out menu for collapsed state */}
                {collapsed && isHovered && (
                  <div className="flyout-menu">
                    <div className="flyout-header">{section.title}</div>
                    <div className="flyout-items">
                      {section.items.map((item) => {
                        if ('to' in item) {
                          const active = isActive(item.to);
                          return (
                            <Link
                              key={item.to}
                              href={item.to}
                              className={`flyout-item ${active ? "active" : ""}`}
                              onClick={() => setHoverSection(null)}
                            >
                              <DynamicIcon 
                                name={item.icon} 
                                className={active ? "icon-active" : "icon-child"}
                                size={16}
                              />
                              <span>{item.label}</span>
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
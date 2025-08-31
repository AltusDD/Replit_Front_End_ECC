import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import sections, { Section, Item, Leaf } from "./layout/navConfig";

// Dynamic icon component
const DynamicIcon = ({ name, className = "", size = 18 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <Icons.Circle size={size} className={className} />;
};

// Fallback sections if import fails
const DEFAULT_SECTIONS: Section[] = [
  { title: "Dashboard", items: [{ label: "Home", to: "/dashboard", icon: "LayoutDashboard" }] },
];

const SECTIONS: Section[] = Array.isArray(sections) && sections.length ? sections : DEFAULT_SECTIONS;

export default function Sidebar() {
  const [location] = useLocation();
  
  // Collapsed state with localStorage persistence
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("ecc:sidebar:collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem("ecc:sidebar:collapsed", collapsed.toString());
    } catch {}
  }, [collapsed]);

  // Expanded groups state - auto-expand when child is active
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
      const stored = localStorage.getItem("ecc:sidebar:expanded");
      const storedState = stored ? JSON.parse(stored) : {};
      return { ...initialState, ...storedState };
    } catch {
      return initialState;
    }
  });

  // Persist expanded state
  useEffect(() => {
    try {
      localStorage.setItem("ecc:sidebar:expanded", JSON.stringify(expandedGroups));
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

  // Hover state for fly-out
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleGroup = (sectionTitle: string) => {
    if (!collapsed) {
      setExpandedGroups(prev => ({
        ...prev,
        [sectionTitle]: !prev[sectionTitle]
      }));
    }
  };

  const isActive = (path: string) => {
    if (!location || !path) return false;
    return location === path || location.startsWith(path + "/");
  };

  const renderNavItem = (item: Leaf, isChild = false) => {
    const active = isActive(item.to);
    
    return (
      <Link
        key={item.to}
        href={item.to}
        className={`nav-item ${active ? "active" : ""} ${isChild ? "child" : ""}`}
        aria-current={active ? "page" : undefined}
      >
        <div className="nav-icon">
          <DynamicIcon 
            name={item.icon} 
            className={active ? "icon-active" : isChild ? "icon-child" : "icon-parent"}
            size={18}
          />
        </div>
        <span className="nav-label">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside 
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      onMouseLeave={() => setHoveredSection(null)}
    >
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img
            src="/brand/altus-logo.png"
            alt="Altus Realty Group"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
        {!collapsed && (
          <button
            className="pin-button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <DynamicIcon name="Pin" size={14} />
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {SECTIONS.map((section) => {
            if (!section.title) return null;
            
            const isExpanded = expandedGroups[section.title] ?? false;
            const isHovered = hoveredSection === section.title && collapsed;
            
            return (
              <div
                key={section.title}
                className={`nav-section ${isHovered ? "hovered" : ""}`}
                onMouseEnter={() => collapsed && section.title && setHoveredSection(section.title)}
              >
                {/* Section Header */}
                <div
                  className="section-header"
                  onClick={() => toggleGroup(section.title!)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
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

                {/* Navigation Items */}
                {(isExpanded || collapsed) && (
                  <div className="nav-items">
                    {section.items.map((item) => {
                      if ('to' in item) {
                        return renderNavItem(item);
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Fly-out Menu for Collapsed State */}
                {collapsed && isHovered && (
                  <div className="flyout-menu">
                    <div className="flyout-header">
                      <div className="flyout-logo">
                        <img
                          src="/brand/altus-logo.png"
                          alt="Altus"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                      <span className="flyout-title">{section.title}</span>
                    </div>
                    <div className="flyout-items">
                      {section.items.map((item) => {
                        if ('to' in item) {
                          return renderNavItem(item, true);
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

      {/* Expand Button for Collapsed State */}
      {collapsed && (
        <div className="sidebar-footer">
          <button
            className="expand-button"
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <DynamicIcon name="ChevronRight" size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
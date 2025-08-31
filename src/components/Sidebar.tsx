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

  // Expanded groups state - auto-expand when child is active, default to expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    
    // Default all sections to expanded, then check for active children
    SECTIONS.forEach((section) => {
      if (section.title) {
        const hasActiveChild = section.items.some((item) => {
          if ('to' in item) {
            return location === item.to || location?.startsWith(item.to + "/");
          }
          return false;
        });
        // Default to expanded, or stay expanded if has active child
        initialState[section.title] = true;
      }
    });

    try {
      const stored = localStorage.getItem("ecc:sidebar:expanded");
      const storedState = stored ? JSON.parse(stored) : {};
      // Merge stored state but keep active sections expanded
      Object.keys(initialState).forEach(key => {
        if (initialState[key]) {
          storedState[key] = true; // Force active sections to stay expanded
        }
      });
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
    setExpandedGroups(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActive = (path: string) => {
    if (!location || !path) return false;
    return location === path || location.startsWith(path + "/");
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
      </div>

      {/* Pin Button Section */}
      {!collapsed && (
        <div className="pin-section">
          <button
            className="pin-button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <DynamicIcon name="Pin" size={14} />
            <span>Collapse</span>
          </button>
        </div>
      )}

      {/* Navigation Content */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {SECTIONS.map((section) => {
            if (!section.title) return null;
            
            const isExpanded = expandedGroups[section.title] ?? true;
            const isHovered = hoveredSection === section.title && collapsed;
            
            return (
              <div
                key={section.title}
                className={`nav-section ${isHovered ? "hovered" : ""}`}
                onMouseEnter={() => collapsed && section.title && setHoveredSection(section.title)}
              >
                {/* Section Header - Only show in expanded mode or if no children */}
                {!collapsed && (
                  <div
                    className="section-header"
                    onClick={() => toggleGroup(section.title!)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                  >
                    <span className="section-title">{section.title}</span>
                    <DynamicIcon 
                      name="ChevronRight" 
                      className={`section-chevron ${isExpanded ? "expanded" : ""}`}
                      size={16}
                    />
                  </div>
                )}

                {/* Navigation Items - Children below parent */}
                {(!collapsed && isExpanded) && (
                  <div className="nav-items">
                    {section.items.map((item) => {
                      if ('to' in item) {
                        const active = isActive(item.to);
                        return (
                          <Link
                            key={item.to}
                            href={item.to}
                            className={`nav-item ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                          >
                            <div className="nav-icon">
                              <DynamicIcon 
                                name={item.icon} 
                                className={active ? "icon-active" : "icon-child"}
                                size={18}
                              />
                            </div>
                            <span className="nav-label">{item.label}</span>
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Collapsed Mode - Show only icons */}
                {collapsed && (
                  <div className="nav-items-collapsed">
                    {section.items.map((item) => {
                      if ('to' in item) {
                        const active = isActive(item.to);
                        return (
                          <Link
                            key={item.to}
                            href={item.to}
                            className={`nav-item-icon ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                            title={item.label}
                          >
                            <DynamicIcon 
                              name={item.icon} 
                              className={active ? "icon-active" : "icon-parent"}
                              size={18}
                            />
                          </Link>
                        );
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
                          const active = isActive(item.to);
                          return (
                            <Link
                              key={item.to}
                              href={item.to}
                              className={`flyout-item ${active ? "active" : ""}`}
                              onClick={() => setHoveredSection(null)}
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
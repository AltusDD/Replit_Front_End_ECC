import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import navigationConfig, { NavSection, NavItem, NavGroup } from "./layout/navConfig";

// Dynamic icon component
const DynamicIcon = ({ name, className = "", size = 18 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <Icons.Circle size={size} className={className} />;
};

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

  // ACCORDION BEHAVIOR: Only one section open at a time
  const [activeSection, setActiveSection] = useState<string | null>(() => {
    // Find which section has an active child on load
    for (const section of navigationConfig) {
      const hasActiveChild = section.items.some((item) => {
        if ('to' in item) {
          return location === item.to || location?.startsWith(item.to + "/");
        } else if ('items' in item) {
          return item.items.some(subItem => 
            location === subItem.to || location?.startsWith(subItem.to + "/")
          );
        }
        return false;
      });
      if (hasActiveChild) return section.title;
    }
    return "Primary"; // Default to Primary section
  });

  // Expanded groups state - for nested groups within sections
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    
    // Auto-expand groups that have an active child
    navigationConfig.forEach((section) => {
      section.items.forEach((item) => {
        if ('items' in item) {
          const hasActiveChild = item.items.some(subItem => 
            location === subItem.to || location?.startsWith(subItem.to + "/")
          );
          initialState[item.label] = hasActiveChild;
        }
      });
    });

    try {
      const stored = localStorage.getItem("ecc:sidebar:groups");
      const storedState = stored ? JSON.parse(stored) : {};
      return { ...initialState, ...storedState };
    } catch {
      return initialState;
    }
  });

  // Persist expanded groups state
  useEffect(() => {
    try {
      localStorage.setItem("ecc:sidebar:groups", JSON.stringify(expandedGroups));
    } catch {}
  }, [expandedGroups]);

  // Auto-expand section and groups when location changes
  useEffect(() => {
    let newActiveSection = activeSection;
    const newGroups = { ...expandedGroups };
    let hasChanges = false;

    navigationConfig.forEach((section) => {
      const hasActiveChild = section.items.some((item) => {
        if ('to' in item) {
          return location === item.to || location?.startsWith(item.to + "/");
        } else if ('items' in item) {
          const groupHasActive = item.items.some(subItem => 
            location === subItem.to || location?.startsWith(subItem.to + "/")
          );
          if (groupHasActive && !newGroups[item.label]) {
            newGroups[item.label] = true;
            hasChanges = true;
          }
          return groupHasActive;
        }
        return false;
      });
      
      if (hasActiveChild && newActiveSection !== section.title) {
        newActiveSection = section.title;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setActiveSection(newActiveSection);
      setExpandedGroups(newGroups);
    }
  }, [location]);

  // Hover state for fly-out
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleSection = (sectionTitle: string) => {
    // Accordion behavior: if clicking the active section, don't close it
    // If clicking a different section, open only that one
    if (activeSection !== sectionTitle) {
      setActiveSection(sectionTitle);
    }
  };

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupLabel]: !prev[groupLabel]
    }));
  };

  const isActive = (path: string) => {
    if (!location || !path) return false;
    return location === path || location.startsWith(path + "/");
  };

  const renderNavItem = (item: NavItem, isNested = false) => {
    const active = isActive(item.to);
    
    return (
      <Link
        key={item.to}
        href={item.to}
        className={`nav-item ${active ? "active" : ""} ${isNested ? "nested" : ""}`}
        aria-current={active ? "page" : undefined}
        tabIndex={0}
        role="menuitem"
      >
        <div className="nav-icon">
          <DynamicIcon 
            name={item.icon} 
            className={active ? "icon-active" : isNested ? "icon-child" : "icon-parent"}
            size={16}
          />
        </div>
        <span className="nav-label">{item.label}</span>
      </Link>
    );
  };

  const renderNavGroup = (group: NavGroup) => {
    const isExpanded = expandedGroups[group.label] ?? false;
    const hasActiveChild = group.items.some(item => isActive(item.to));

    return (
      <div key={group.label} className="nav-group">
        <div
          className={`group-header ${hasActiveChild ? "has-active" : ""}`}
          onClick={() => toggleGroup(group.label)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleGroup(group.label);
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={`group-${group.label.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <div className="group-icon">
            <DynamicIcon 
              name={group.icon} 
              className={hasActiveChild ? "icon-active" : "icon-parent"}
              size={16}
            />
          </div>
          <span className="group-label">{group.label}</span>
          <DynamicIcon 
            name="ChevronRight" 
            className={`group-chevron ${isExpanded ? "expanded" : ""}`}
            size={14}
          />
        </div>
        {isExpanded && (
          <div 
            className="group-items"
            id={`group-${group.label.replace(/\s+/g, '-').toLowerCase()}`}
            role="region"
            aria-labelledby={`group-header-${group.label.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {group.items.map(item => renderNavItem(item, true))}
          </div>
        )}
      </div>
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
      </div>

      {/* Navigation Content */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {navigationConfig.map((section) => {
            const isExpanded = activeSection === section.title;
            const isHovered = hoveredSection === section.title && collapsed;
            
            return (
              <div
                key={section.title}
                className={`nav-section ${isHovered ? "hovered" : ""}`}
                onMouseEnter={() => collapsed && setHoveredSection(section.title)}
              >
                {/* Section Header - Only show in expanded mode */}
                {!collapsed && (
                  <div
                    className="section-header"
                    onClick={() => toggleSection(section.title)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSection(section.title);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span className="section-title">{section.title}</span>
                    <DynamicIcon 
                      name="ChevronRight" 
                      className={`section-chevron ${isExpanded ? "expanded" : ""}`}
                      size={14}
                    />
                  </div>
                )}

                {/* Navigation Items - Regular items and groups */}
                {(!collapsed && isExpanded) && (
                  <div 
                    className="nav-items"
                    id={`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                    role="region"
                    aria-labelledby={`header-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {section.items.map((item) => {
                      if ('to' in item) {
                        return renderNavItem(item);
                      } else if ('items' in item) {
                        return renderNavGroup(item);
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
                      } else if ('items' in item) {
                        const hasActive = item.items.some(subItem => isActive(subItem.to));
                        return (
                          <div
                            key={item.label}
                            className={`nav-item-icon ${hasActive ? "active" : ""}`}
                            title={item.label}
                          >
                            <DynamicIcon 
                              name={item.icon} 
                              className={hasActive ? "icon-active" : "icon-parent"}
                              size={18}
                            />
                          </div>
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
                        } else if ('items' in item) {
                          return (
                            <div key={item.label} className="flyout-group">
                              <div className="flyout-group-header">
                                <DynamicIcon 
                                  name={item.icon} 
                                  size={16} 
                                  className={item.items.some(subItem => isActive(subItem.to)) ? "icon-active" : "icon-parent"} 
                                />
                                <span>{item.label}</span>
                              </div>
                              <div className="flyout-group-items">
                                {item.items.map(subItem => {
                                  const active = isActive(subItem.to);
                                  return (
                                    <Link
                                      key={subItem.to}
                                      href={subItem.to}
                                      className={`flyout-subitem ${active ? "active" : ""}`}
                                      onClick={() => setHoveredSection(null)}
                                    >
                                      <DynamicIcon 
                                        name={subItem.icon} 
                                        className={active ? "icon-active" : "icon-child"}
                                        size={14}
                                      />
                                      <span>{subItem.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
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

      {/* Pin/Unpin Button at Bottom */}
      <div className="sidebar-footer">
        {!collapsed ? (
          <button
            className="pin-button"
            onClick={toggleCollapsed}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapsed();
              }
            }}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            tabIndex={0}
          >
            <DynamicIcon name="Pin" size={14} />
            <span>Collapse</span>
          </button>
        ) : (
          <button
            className="expand-button"
            onClick={toggleCollapsed}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapsed();
              }
            }}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            tabIndex={0}
          >
            <DynamicIcon name="ChevronRight" size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
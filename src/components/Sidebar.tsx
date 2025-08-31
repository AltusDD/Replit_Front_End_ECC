import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import sections, { Section } from "./layout/navConfig";

// Fallback sections logic
const DEFAULT_SECTIONS: Section[] = [
  { title: "Dashboard", items: [{ label: "Home", to: "/dashboard" }] },
];

const SECTIONS: Section[] = Array.isArray(sections) && sections.length ? sections : DEFAULT_SECTIONS;

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

  // Group expanded state persisted to localStorage
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("ecc:nav:expanded");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ecc:nav:expanded", JSON.stringify(expandedGroups));
    } catch {}
  }, [expandedGroups]);

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

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} data-role="sidebar">
      <div className="brand">
        <img
          className="brand-logo"
          src="/brand/altus-logo.png"
          alt="Altus Realty Group"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <button
          className="pinBtn hide-when-collapsed"
          onClick={toggleCollapse}
          aria-pressed={collapsed ? "true" : "false"}
        >
          {collapsed ? "📌" : "📌"}
        </button>
      </div>

      <div className="sidebar-scroll">
        <nav role="navigation" data-nav>
          {SECTIONS.map((section) => {
            const isExpanded = expandedGroups[section.title || ""] ?? true;
            
            return (
              <div key={section.title} className="section">
                {section.title && (
                  <div
                    className="section-title"
                    onClick={() => toggleGroup(section.title || "")}
                    role="button"
                    aria-expanded={isExpanded}
                  >
                    {section.title}
                  </div>
                )}
                
                {isExpanded && (
                  <div className="nav-items">
                    {section.items.map((item) => {
                      // Type guard to ensure we only process leaf items
                      if ('to' in item) {
                        const active = isActive(item.to);
                        
                        return (
                          <Link
                            key={item.to}
                            href={item.to}
                            className={`nav-row leaf ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                          >
                            <span className="icon">•</span>
                            <span className="label">{item.label}</span>
                            <span className="expand"></span>
                          </Link>
                        );
                      }
                      return null;
                    })}
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
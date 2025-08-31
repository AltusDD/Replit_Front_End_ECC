
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import navConfig from './layout/navConfig';
import Logo from './layout/Logo';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const isActive = (path: string) => {
    if (!location || !path) return false;
    return location === path || location.startsWith(path + '/');
  };

  const renderNavItems = () => {
    if (!navConfig || !Array.isArray(navConfig)) {
      return <div className="text-red-500">Navigation config error</div>;
    }

    return navConfig.map((section, sectionIndex) => {
      if (!section || typeof section !== 'object') {
        return null;
      }

      const { label, items, path } = section;
      
      if (!label) {
        return null;
      }

      // Handle leaf nodes (no children)
      if (path && (!items || items.length === 0)) {
        return (
          <div key={`section-${sectionIndex}-${label}`} className="nav-item">
            <Link href={path}>
              <div className={`nav-link ${isActive(path) ? 'active' : ''}`}>
                {!collapsed && <span className="nav-label">{label}</span>}
              </div>
            </Link>
          </div>
        );
      }

      // Handle sections with children
      const isOpen = openSections.has(label);
      
      return (
        <div key={`section-${sectionIndex}-${label}`} className="nav-section">
          <div 
            className="nav-section-header"
            onClick={() => toggleSection(label)}
          >
            <div className="nav-section-title">
              {!collapsed && <span>{label}</span>}
            </div>
            {!collapsed && (
              <div className="nav-section-icon">
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </div>
          
          {isOpen && !collapsed && items && Array.isArray(items) && (
            <div className="nav-section-items">
              {items.map((item, itemIndex) => {
                if (!item || typeof item !== 'object' || !item.label || !item.path) {
                  return null;
                }
                
                return (
                  <div key={`item-${sectionIndex}-${itemIndex}-${item.label}`} className="nav-item">
                    <Link href={item.path}>
                      <div className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                        <span className="nav-label">{item.label}</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Logo collapsed={collapsed} />
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-content">
          {renderNavItems()}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

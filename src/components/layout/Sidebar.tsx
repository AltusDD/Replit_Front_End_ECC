import React, { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { NAV } from './navConfig';

function NavLink({ href, children }:{ href:string, children:React.ReactNode}){
  const [match] = useRoute(href);
  return <Link href={href} className={match?'active':''}>{children}</Link>;
}

export default function Sidebar(){
  const [collapsed, setCollapsed] = useState(false);
  const [pinnedSections, setPinnedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Primary', 'Portfolio V3']));

  const toggleSection = (sectionLabel: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionLabel)) {
      newExpanded.delete(sectionLabel);
    } else {
      newExpanded.add(sectionLabel);
    }
    setExpandedSections(newExpanded);
  };

  const togglePin = (sectionLabel: string) => {
    const newPinned = new Set(pinnedSections);
    if (newPinned.has(sectionLabel)) {
      newPinned.delete(sectionLabel);
    } else {
      newPinned.add(sectionLabel);
    }
    setPinnedSections(newPinned);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <img alt="Altus" src="/logo.png" style={{width:64, height:64, margin: '0 auto', display: 'block'}}/>
      </div>
      
      <div className="sidebar-controls">
        <button onClick={() => setCollapsed(!collapsed)} className="control-btn">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && NAV.map(section=>{
        const isExpanded = expandedSections.has(section.label);
        const isPinned = pinnedSections.has(section.label);
        
        return (
          <div key={section.label} className="nav">
            <div className="group" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span onClick={() => toggleSection(section.label)} style={{cursor:'pointer'}}>
                {section.label.toUpperCase()} {isExpanded ? '▼' : '▶'}
              </span>
              <button onClick={() => togglePin(section.label)} className="pin-btn" title={isPinned ? 'Unpin' : 'Pin'}>
                {isPinned ? '📌' : '📍'}
              </button>
            </div>
            {(isExpanded || isPinned) && section.items.map(item=>(
              <div key={item.label} style={{margin:'6px 6px 8px'}}>
                {'path' in item ? (
                  <NavLink href={item.path}>{item.label}</NavLink>
                ) : (
                  <>
                    {item.label !== section.label && <div style={{color:'var(--muted-2)',fontSize:12,margin:'6px 4px'}}>{item.label}</div>}
                    {(item as any).items.map((leaf: any)=>(
                      <NavLink key={leaf.path} href={leaf.path}>{leaf.label}</NavLink>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </aside>
  );
}
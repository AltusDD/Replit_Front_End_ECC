import React from 'react';
import { Link, useRoute } from 'wouter';
import { NAV } from './navConfig';

function NavLink({ href, children }:{ href:string, children:React.ReactNode}){
  const [match] = useRoute(href);
  return <Link href={href} className={match?'active':''}>{children}</Link>;
}

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <img alt="Altus" src="/logo.png" style={{width:32,height:32}}/><strong>Empire Command Center</strong>
      </div>
      {NAV.map(section=>(
        <div key={section.label} className="nav">
          <div className="group">{section.label.toUpperCase()}</div>
          {section.items.map(item=>(
            <div key={item.label} style={{margin:'6px 6px 8px'}}>
              {item.type === 'leaf' ? (
                <NavLink href={item.path}>{item.label}</NavLink>
              ) : (
                <>
                  {item.label !== section.label && <div style={{color:'var(--muted-2)',fontSize:12,margin:'6px 4px'}}>{item.label}</div>}
                  {item.items.map(leaf=>(
                    <NavLink key={leaf.path} href={leaf.path}>{leaf.label}</NavLink>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="hr"></div>
      <div className="nav">
        <div className="group">TOOLS</div>
        <NavLink href="/tools/api-probe">API Probe</NavLink>
      </div>
    </aside>
  );
}
import React from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_SECTIONS } from './navConfig';

export default function Nav(){
  const [loc] = useLocation();
  return (
    <nav className="nav">
      <div className="brand">Empire Command Center</div>
      {NAV_SECTIONS.map(sec => (
        <div key={sec.label} className="navSection">
          <div className="navSectionTitle">{sec.label}</div>
          <div className="navLinks">
            {sec.children?.map(it => it.path ? (
              <Link key={it.path} href={it.path} className={'navLink' + (loc.startsWith(it.path) ? ' active' : '')}>
                <span>{it.label}</span>
              </Link>
            ) : null)}
          </div>
        </div>
      ))}
    </nav>
  );
}

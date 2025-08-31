import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import navConfig from "./navConfig";

function useCollapsed() {
  const key = "nav:collapsed";
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem(key, collapsed ? "1" : "0"); } catch {} }, [collapsed]);
  return { collapsed, setCollapsed };
}

export default function Nav(){
  const [location] = useLocation();
  const { collapsed, setCollapsed } = useCollapsed();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <img className="brandLogo" src="/logo.png" alt="Altus" />
        <button className="pin" title={collapsed ? "Unpin" : "Pin"} onClick={()=>setCollapsed(!collapsed)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="nav-root">
        {navConfig.map((section, si) => (
          <div className="nav-section" key={si}>
            <div className="nav-title">{section.title}</div>
            <div className="nav-items">
              {section.items.map((it, ii) => {
                const active = location === it.path;
                return (
                  <Link href={it.path} key={ii}>
                    <a className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                      {it.icon ? <span className="icon" aria-hidden>{/* icon is optional string or element */}{typeof it.icon === "string" ? it.icon : it.icon}</span> : null}
                      <span className="label">{it.label}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

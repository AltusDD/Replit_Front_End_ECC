
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { navConfig } from "./navConfig";
import { iconFor } from "./iconFor";
import classNames from "classnames";
import "./Nav.css";

export function Nav() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstIcon = document.querySelector(".leaf svg");
    if (firstIcon) {
      const width = (firstIcon as HTMLElement).offsetWidth;
      document.documentElement.style.setProperty("--icon-size", `${width + 32}px`);
    }
  }, [collapsed]);

  return (
    <div ref={navRef} className={classNames("sidebar", { collapsed })}>
      <div className="logoContainer">
        <img className="brandLogo" src="/your-logo-path.png" alt="Empire Logo" />
      </div>

      <nav className="navSection">
        {navConfig.map((sec, i) => (
          <div key={i}>
            <div className="section">
              {sec.groups.map((group, j) => (
                <div key={j} className="group">
                  <button className="groupBtn">
                    {iconFor(group.icon)}
                    {!collapsed && <span>{group.label}</span>}
                  </button>
                  <div className="leafList">
                    {group.items.map((leaf, k) => (
                      <a
                        key={k}
                        href={leaf.href}
                        className={classNames("leaf", {
                          active: location.pathname === leaf.href,
                        })}
                      >
                        {iconFor(leaf.icon)}
                        {!collapsed && <span>{leaf.label}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="pinRow">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "Unpin ◩" : "Pin ◪"}
        </button>
      </div>
    </div>
  );
}

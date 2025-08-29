import { Link, useLocation } from "wouter";
import nav from "./layout/navConfig";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Empire Command Center</div>
        <nav className="nav">
          {nav.map(group => (
            <div className="group" key={group.title}>
              <div className="group-title">{group.title}</div>
              <div className="links stack">
                {group.items.map(it => {
                  const active = loc.startsWith(it.href);
                  return (
                    <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined}>
                      {it.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

import { Link, useLocation } from 'wouter';
import { NAV } from './navConfig';

export default function Nav() {
  const [loc] = useLocation();
  return (
    <aside className="sidebar">
      <div className="brand">Empire Command Center</div>
      {NAV.map((sec) => (
        <div key={sec.title}>
          <div className="nav-section">{sec.title}</div>
          {sec.items.map((it) => {
            const active = loc === it.path;
            return (
              <Link key={it.path} href={it.path} className={`navlink ${active ? 'active' : ''}`}>
                {it.label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

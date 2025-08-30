import { Link, useLocation } from 'wouter';
import { NAV } from './navConfig';

export default function Nav() {
  const [loc] = useLocation();
  
  // Group nav items by section
  const sections = ['PRIMARY', 'PORTFOLIO', 'TOOLS'] as const;
  const navBySection = sections.map(sectionName => ({
    title: sectionName,
    items: NAV.filter(item => item.section === sectionName)
  }));

  return (
    <aside className="sidebar">
      <div className="brand">Empire Command Center</div>
      {navBySection.map(section => (
        <div key={section.title}>
          <div className="nav-section">{section.title}</div>
          {section.items.map(item => {
            const active = loc === item.href;
            return (
              <Link key={item.href} href={item.href} className={`navlink ${active ? 'active' : ''}`}>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
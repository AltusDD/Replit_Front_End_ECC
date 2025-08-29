import { Link, useRoute } from 'wouter'
import nav from './navConfig'

function Item({ href, label }: { href:string; label:string }) {
  const [active] = useRoute(href === '/dashboard' ? '/dashboard' : href)
  return (
    <Link href={href}>
      <a className={`nav-link ${active ? 'active' : ''}`}>{label}</a>
    </Link>
  )
}

export default function Nav(){
  return (
    <div>
      <div className="brand">Empire Command Center</div>
      {nav.map(sec => (
        <div key={sec.section} className="section-block">
          <div className="section">{sec.section}</div>
          <div className="nav">
            {sec.items.map(it => <Item key={it.href} {...it} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

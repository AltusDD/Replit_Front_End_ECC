import { Link, useRoute } from 'wouter'
import nav from './navConfig'

function Item({ href, label }: { href:string; label:string }) {
  const [active] = useRoute(href === '/dashboard' ? '/dashboard' : href)
  return (
    <Link href={href} className={`nav-link ${active ? 'active' : ''}`}>
      {label}
    </Link>
  )
}

export default function Nav(){
  return (
    <div>
      <div className="brand">Empire Command Center</div>
      {nav.map(sec => (
        <div key={sec.title} className="section-block">
          <div className="section">{sec.title}</div>
          <div className="nav">
            {sec.items.map(it => <Item key={it.href} {...it} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

import { Link, useLocation } from "wouter";
import { NAV, Section, Group, Leaf } from "./navConfig";

function LeafLink({leaf}:{leaf:Leaf}) {
  const [loc] = useLocation();
  const active = loc === leaf.path;
  return (
    <li className="leaf">
      <Link href={leaf.path} className={active ? "active" : ""}>{leaf.label}</Link>
    </li>
  );
}

function RenderItem(it: Leaf | Group) {
  if ('path' in it) return <LeafLink leaf={it} />;
  return (
    <li className="group">
      <div className="gH">{it.label}</div>
      <ul className="nav">
        {it.children.map((c) => <LeafLink key={c.path} leaf={c} />)}
      </ul>
    </li>
  );
}

function SectionBlock({sec}:{sec:Section}) {
  return (
    <div className="navSec">
      <div className="secH">{sec.label}</div>
      <ul className="nav">
        {sec.items.map((it, i) => <div key={i+(('path'in it)?it.path:it.label)}>{RenderItem(it)}</div>)}
      </ul>
    </div>
  );
}

export default function Nav(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/logo.png" className="logo" alt="Altus Realty" />
        <div className="title">Empire Command Center</div>
      </div>
      {NAV.map((sec, i) => <SectionBlock key={sec.label+i} sec={sec} />)}
    </aside>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Circle, FileText, Home, LayoutDashboard, Building2, Boxes, Users } from "lucide-react";
import sections, { Section, Item, Group, Leaf } from "./layout/navConfig";

const LS_KEY = "ecc:nav:collapsed";
const SIDEBAR_W = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--ecc-sidebar-w") || "280", 10) || 280;
const SIDEBAR_W_COLLAPSED = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--ecc-sidebar-w-collapsed") || "72", 10) || 72;

function useCollapsed() {
const [collapsed, setCollapsed] = useState<boolean>(() => {
try { return localStorage.getItem(LS_KEY) === "1"; } catch { return false; }
});
useEffect(() => {
try { localStorage.setItem(LS_KEY, collapsed ? "1" : "0"); } catch {}
const px = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;
document.documentElement.style.setProperty("--ecc-sidepad", `${px}px`);
}, [collapsed]);
return { collapsed, setCollapsed };
}

function useActivePath() {
const [loc] = useLocation();
return loc;
}

function Icon({ name, className }: { name?: string; className?: string }) {
// Ensure icon component import and use correct mapping.
const Cmp = name ? Icons[name] : Circle;
return <Cmp size={18} className={className} aria-hidden="true" />;
}

export default function Sidebar() {
const { collapsed, setCollapsed } = useCollapsed();
const activePath = useActivePath();
const [hovering, setHovering] = useState(false);

// One-time mount shim: mark primary & reserve space even before first paint
useEffect(() => {
document.documentElement.dataset.sidebarMounted = "1";
const pad = (localStorage.getItem(LS_KEY) === "1") ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;
document.documentElement.style.setProperty("--ecc-sidepad", `${pad}px`);
}, []);

// Inline visited-link override to beat global theme
useEffect(() => {
const style = document.createElement("style");
style.setAttribute("data-ecc-inline", "sidebar");
style.innerHTML = `.sidebar a, .sidebar a:link, .sidebar a:visited, .sidebar a:active { color: var(--ecc-text) !important; text-decoration:none!important; }`;
document.head.appendChild(style);
return () => { style.remove(); };
}, []);

const content = (
<nav className="nav">
{sections.map((section, i) => (
<div className="section" key={i}>
{section.title && <div className="section-title">{section.title}</div>}
<div className="section-items">
{section.items.map((item, j) => {
const isGroup = (item as Group).children !== undefined;
if (isGroup) {
const g = item as Group;
return (
<div className="group" key={`${i}-${j}`}>
<div className="row parent">
<Icon name={g.icon} className="icon parent" />
<span className="label">{g.label}</span>
</div>
<div className="children">
{g.children.map((leaf, k) => {
const active = activePath.startsWith(leaf.to);
return (
<Link href={leaf.to} key={`${i}-${j}-${k}`}>
<a className={`row child ${active ? "active" : ""}`} data-to={leaf.to}>
<Icon name={leaf.icon} className="icon child" />
<span className="label">{leaf.label}</span>
</a>
</Link>
);
})}
</div>
</div>
);
} else {
const leaf = item as Leaf;
const active = activePath.startsWith(leaf.to);
return (
<Link href={leaf.to} key={`${i}-${j}`}>
<a className={`row leaf ${active ? "active" : ""}`} data-to={leaf.to}>
<Icon name={leaf.icon} className="icon child" />
<span className="label">{leaf.label}</span>
</a>
</Link>
);
}
})}
</div>
</div>
))}
</nav>
);

return (
<aside
className={`sidebar ${collapsed ? "collapsed" : ""}`}
data-ecc="primary"
onMouseEnter={() => setHovering(true)}
onMouseLeave={() => setHovering(false)}
>
<div className="topbar">
<button className="pin" onClick={() => setCollapsed(c => !c)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
{collapsed ? "›" : "Pin"}
</button>
</div>

  <div className="sidebar-scroll">
    {content}
  </div>

  <button className="expand" onClick={() => setCollapsed(false)} aria-hidden={!collapsed}>
    ‹
  </button>

  {/* Hover fly-out (overlay) */}
  <div className={`flyout ${collapsed && hovering ? "show" : ""}`}>
    <div className="sidebar-scroll">{content}</div>
  </div>
</aside>


);
}
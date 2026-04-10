import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";

// =======================================================
// 1. CORRECT LOGO AND BRANDING SETUP
// =======================================================
const LOGO_WIDE = "/brand/altus-logo.png";
const LOGO_SQUARE = "/brand/altus-mark.png";

function SafeImg({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties; }) {
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(true); }, [src]);
  if (!ok) return null;
  return <img src={src} alt={alt} style={{ display: "block", ...style }} onError={() => setOk(false)} draggable={false} />;
}


// =======================================================
// 2. NAV DATA AND TYPES (FROM YOUR PREFERRED VERSION)
// =======================================================
type IconName =
  | "LayoutDashboard" | "Boxes" | "FileText" | "Shield" | "Scale" | "MessageSquare"
  | "Hammer" | "BarChart3" | "PieChart" | "Settings" | "Database" | "Users"
  | "IdCard" | "Package" | "FolderOpen" | "ClipboardList" | "Workflow" | "Receipt"
  | "Building2" | "Wrench" | "Cpu" | "Link2" | "ChartNoAxesColumn" | "FileSpreadsheet" | "Shuffle";

type NavChild = { title: string; path: string; icon?: IconName };
type NavParent = { title: string; icon: IconName; path?: string; children?: NavChild[] };

const NAV: NavParent[] = [
  { title: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },
  {
    title: "Portfolio V3", icon: "Boxes",
    children: [
      { title: "Properties", path: "/portfolio/properties", icon: "Building2" },
      { title: "Units", path: "/portfolio/units", icon: "Package" },
      { title: "Leases", path: "/portfolio/leases", icon: "FileSpreadsheet" },
      { title: "Tenants", path: "/portfolio/tenants", icon: "Users" },
      { title: "Owners", path: "/portfolio/owners", icon: "IdCard" },
      { title: "Owner Transfer", path: "/owners/transfer", icon: "Shuffle" },
    ],
  },
  {
    title: "Accounting", icon: "FileText",
    children: [ { title: "Overview", path: "/ops/accounting/overview", icon: "ClipboardList" } ],
  },
  {
    title: "AI Analytics", icon: "Shield",
    children: [ { title: "Risk Summary", path: "/ops/ai/risk-summary", icon: "Shield" } ],
  },
  {
    title: "Legal Tracker", icon: "Scale",
    children: [ { title: "Case Manager", path: "/ops/legal/case-manager", icon: "ClipboardList" } ],
  },
  {
    title: "Communication", icon: "MessageSquare",
    children: [ { title: "Queue", path: "/ops/comms/queue", icon: "MessageSquare" } ],
  },
  {
    title: "Construction & Repair", icon: "Hammer",
    children: [ { title: "Work Orders", path: "/ops/maintenance/work-orders", icon: "Hammer" } ],
  },
  { 
    title: "Reports", 
    icon: "BarChart3", 
    children: [
      { title: "Create", path: "/reports/create", icon: "FileText" },
      { title: "Saved", path: "/reports/saved", icon: "FileText" },
      { title: "Templates", path: "/reports/templates", icon: "FileText" },
    ]
  },
  { title: "Growth", icon: "PieChart", children: [{ title: "Marketing", path: "/growth/marketing", icon: "PieChart" }] },
  {
    title: "Systems", icon: "Settings",
    children: [ 
      { title: "Settings", path: "/system/settings", icon: "Settings" },
      { title: "Integrations", path: "/systems/integrations", icon: "Link2" },
    ],
  },
  {
    title: "Data Management", icon: "Database",
    children: [ { title: "Sync Audit", path: "/data/sync-audit", icon: "ClipboardList" } ],
  },
  {
    title: "Investor Portal", icon: "PieChart",
    children: [ { title: "Dashboard", path: "/investor/dashboard", icon: "LayoutDashboard" } ],
  },
  {
    title: "Integrations", icon: "Link2",
    children: [ { title: "Dropbox Files", path: "/integrations/dropbox", icon: "FolderOpen" } ],
  },
];


// =======================================================
// 3. HELPERS AND HOOKS (FROM YOUR PREFERRED VERSION)
// =======================================================
const STORAGE_KEY = "ecc.sidebar.collapsed";
const OPEN_DELAY_MS = 80;
const CLOSE_DELAY_MS = 800;
const FLYOUT_WIDTH = 296;

function iconOf(name?: IconName) {
  return (name && (Icons as any)[name]) || Icons.Circle;
}
function clampToViewport(x: number, y: number, w: number, h: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let nx = Math.max(8, x);
  let ny = Math.max(8, y);
  if (nx + w > vw - 8) nx = vw - w - 8;
  if (ny + h > vh - 8) ny = vh - h - 8;
  return { x: nx, y: ny };
}
function useCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "false"); }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed)); } catch {}
  }, [collapsed]);
  return { collapsed, setCollapsed };
}


// =======================================================
// 4. SIDEBAR COMPONENT (REBUILT FOR STABILITY AND CORRECT LAYOUT)
// =======================================================
export default function Sidebar() {
  const [location] = useLocation();
  const { collapsed, setCollapsed } = useCollapsed();
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);

  useEffect(() => {
    const activeParent = NAV.find(p => p.children?.some(c => location.startsWith(c.path)) || (p.path && location.startsWith(p.path)));
    setExpandedTitle(activeParent?.title || null);
  }, [location]);

  const [flyOpen, setFlyOpen] = useState(false);
  const [flyTitle, setFlyTitle] = useState("");
  const [flyIcon, setFlyIcon] = useState<IconName | undefined>(undefined);
  const [flyItems, setFlyItems] = useState<NavChild[]>([]);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({});
  const portalRef = useRef<HTMLDivElement | null>(null);
  const rowTimerOpen = useRef<number | null>(null);
  const rowTimerClose = useRef<number | null>(null);
  const hoverParent = useRef(false);
  const hoverFlyout = useRef(false);

  useEffect(() => {
    const node = document.createElement("div");
    node.id = "ecc-flyout-root";
    document.body.appendChild(node);
    portalRef.current = node;
    return () => { node.remove(); };
  }, []);

  const isActive = (path?: string) => !!path && (location === path || location.startsWith(path + "/"));

  const openFly = (parent: NavParent, rect: DOMRect) => {
    const estH = Math.min(56 * (parent.children?.length || 0) + 56, window.innerHeight - 16);
    const { x, y } = clampToViewport(rect.right + 6, rect.top, FLYOUT_WIDTH, estH);
    setFlyTitle(parent.title);
    setFlyIcon(parent.icon);
    setFlyItems(parent.children || []);
    setFlyStyle({ left: x, top: y, width: FLYOUT_WIDTH }); // Removed fixed positioning
    setFlyOpen(true);
  };
  const scheduleOpen = (parent: NavParent, rect: DOMRect) => {
    if (rowTimerClose.current) window.clearTimeout(rowTimerClose.current);
    rowTimerOpen.current = window.setTimeout(() => openFly(parent, rect), OPEN_DELAY_MS);
  };
  const scheduleClose = () => {
    if (rowTimerOpen.current) window.clearTimeout(rowTimerOpen.current);
    rowTimerClose.current = window.setTimeout(() => {
      if (!hoverParent.current && !hoverFlyout.current) {
        setFlyOpen(false);
      }
    }, CLOSE_DELAY_MS);
  };

  return (
    <aside className={`ecc-sidebar ${collapsed ? "is-collapsed" : "is-expanded"}`}>
      <div className="ecc-sidebar__inner">

        <div
          className="ecc-header"
          // This style block ensures the logo is always centered
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '88px',
            padding: '0.5rem 0'
          }}
        >
            <Link href="/" className="ecc-logo-link">
                <SafeImg
                    src={collapsed ? LOGO_SQUARE : LOGO_WIDE}
                    alt="Altus Logo"
                    style={{
                        filter: "brightness(1.75)",
                        transition: "height 0.2s ease-in-out",
                        height: collapsed ? "52px" : "60px",
                        width: "auto",
                        objectFit: "contain",
                    }}
                />
            </Link>
        </div>

        <nav className="ecc-scroll" role="list">
          {NAV.map((p) => {
            const ParentIcon = iconOf(p.icon);
            const hasKids = !!p.children?.length;
            const isExpanded = expandedTitle === p.title;
            const parentActive = isActive(p.path) || (hasKids && p.children!.some((c) => isActive(c.path)));
            const rowRef = useRef<HTMLDivElement | null>(null);

            const rowContent = (
              <div
                className="ecc-row-inner"
                onMouseEnter={() => {
                  hoverParent.current = true;
                  if (collapsed && hasKids && rowRef.current) scheduleOpen(p, rowRef.current.getBoundingClientRect());
                }}
                onMouseLeave={() => {
                  hoverParent.current = false;
                  if (collapsed) scheduleClose();
                }}
              >
                <div className="ecc-icon-wrap"><ParentIcon size={20} /></div>
                {!collapsed && (
                  <>
                    <span className="ecc-label">{p.title}</span>
                    {hasKids && <div className="ecc-caret">{isExpanded ? <Icons.ChevronDown size={16} /> : <Icons.ChevronRight size={16} />}</div>}
                  </>
                )}
              </div>
            );

            // If it's a direct link with no children, the whole row is a Link.
            if (p.path && !hasKids) {
              return (
                <div key={p.title} ref={rowRef}>
                  <Link href={p.path} className={`ecc-row ${parentActive ? "is-active" : ""}`}>
                    {rowContent}
                  </Link>
                </div>
              );
            }

            // If it has children, it's a div that toggles them.
            return (
              <div key={p.title} ref={rowRef} className={`ecc-row ${parentActive ? "is-active" : ""}`}>
                <div
                    className="ecc-row-clickable"
                    onClick={() => setExpandedTitle(isExpanded ? null : p.title)}
                >
                    {rowContent}
                </div>

                {!collapsed && hasKids && isExpanded && (
                  <div className="ecc-children" role="group">
                    {p.children!.map((c) => {
                      const CIcon = iconOf(c.icon);
                      const active = isActive(c.path);
                      return (
                        <Link key={c.title} href={c.path} className={`ecc-child ${active ? "is-active" : ""}`}>
                          <CIcon className="ecc-child-icon" size={16} />
                          <span className="ecc-child-label">{c.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ecc-footer">
          <button className="ecc-pin" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Icons.PinOff size={16}/> : <Icons.Pin size={16}/>}
            {!collapsed && <span className="ecc-pin-label">Collapse</span>}
          </button>
        </div>
      </div>

      {collapsed && flyOpen && flyItems.length > 0 && portalRef.current &&
        createPortal(
          <div
            className="ecc-flyout" style={flyStyle} role="menu"
            onMouseEnter={() => { hoverFlyout.current = true; if (rowTimerClose.current) window.clearTimeout(rowTimerClose.current); }}
            onMouseLeave={() => { hoverFlyout.current = false; scheduleClose(); }}
          >
            <div className="ecc-flyout-head">{flyTitle}</div>
            <div className="ecc-flyout-list">
              {flyItems.map((c) => {
                const CIcon = iconOf(c.icon);
                return (
                  <Link key={c.title} href={c.path} className="ecc-flyout-item" role="menuitem">
                    <CIcon className="ecc-flyout-icon" size={16} />
                    <span className="ecc-flyout-label">{c.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>,
          portalRef.current
        )
      }
    </aside>
  );
}
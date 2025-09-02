import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";
import { NAV_SECTIONS } from "@/config/navigation";

// Optional badge hook (non-breaking if your store isn't present)
let useBadgeCounts: () => Record<string, number>;
try {
  // Prefer alias if you have one
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useBadgeCounts = require("@/state/badges").useBadgeCounts;
} catch {
  useBadgeCounts = () => ({});
}

type IconName = keyof typeof Icons;

type NavChild = {
  title: string;
  path: string;
  icon?: IconName;
  badgeKey?: string;
};

type NavParent = {
  title: string;
  icon: IconName;
  path?: string;
  children?: NavChild[];
  badgeKey?: string;
};

const STORAGE_KEY = "ecc.sidebar.collapsed";

/** Hook: persisted collapsed state */
function useCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : true; // start collapsed by default
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);
  return { collapsed, setCollapsed };
}

/** Utility: dynamic lucide icon */
function useIcon(name?: IconName) {
  return useMemo(() => {
    if (!name) return null;
    const I = Icons[name];
    return I ?? Icons.Circle;
  }, [name]);
}

/** Flyout portal root (fixed-position sibling inside body) */
function useFlyoutRoot() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = document.createElement("div");
    node.setAttribute("id", "ecc-flyout-root");
    document.body.appendChild(node);
    ref.current = node;
    return () => {
      node.remove();
    };
  }, []);
  return ref;
}

/** Bounds utility to keep flyout on-screen */
function confineToViewport(x: number, y: number, w: number, h: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let nx = x;
  let ny = y;
  if (nx + w > vw) nx = Math.max(0, vw - w - 8);
  if (ny + h > vh) ny = Math.max(0, vh - h - 8);
  return { x: nx, y: ny };
}

export default function Sidebar() {
  const [location] = useLocation();
  const { collapsed, setCollapsed } = useCollapsed();
  const badges = useBadgeCounts();
  const flyRootRef = useFlyoutRoot();

  // Flyout state
  const [flyOpen, setFlyOpen] = useState(false);
  const [flyItems, setFlyItems] = useState<NavChild[]>([]);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({});
  const [activeParentTitle, setActiveParentTitle] = useState<string | null>(null);

  // timers to prevent hover-gap flicker
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const handleParentEnter = (
    e: React.MouseEvent,
    parent: NavParent,
    rowEl: HTMLDivElement
  ) => {
    if (!collapsed) return; // flyout only used in collapsed mode
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openTimer.current = window.setTimeout(() => {
      const rect = rowEl.getBoundingClientRect();
      const width = 288; // flyout width
      const estHeight = Math.min(56 * (parent.children?.length || 1) + 16, window.innerHeight - 16);
      const { x, y } = confineToViewport(rect.right + 6, rect.top, width, estHeight);

      setFlyItems(parent.children || []);
      setActiveParentTitle(parent.title);
      setFlyStyle({
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
      });
      setFlyOpen(true);
    }, 80); // small delay to avoid jitter
  };

  const handleParentLeave = () => {
    if (!collapsed) return;
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    // Soft-close with small delay so crossing the "gap" doesn't flicker
    closeTimer.current = window.setTimeout(() => {
      setFlyOpen(false);
      setActiveParentTitle(null);
      setFlyItems([]);
    }, 120);
  };

  const handleFlyoutEnter = () => {
    if (!collapsed) return;
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleFlyoutLeave = () => {
    if (!collapsed) return;
    closeTimer.current = window.setTimeout(() => {
      setFlyOpen(false);
      setActiveParentTitle(null);
      setFlyItems([]);
    }, 120);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    // Ensure leading slash logic is safe
    try {
      return location === path || location.startsWith(path + "/");
    } catch {
      return false;
    }
  };

  return (
    <aside
      className={`ecc-sidebar ${collapsed ? "is-collapsed" : "is-expanded"}`}
      data-ecc="primary"
      aria-label="Primary"
      role="navigation"
    >
      <div className="ecc-rail">
        {/* Header / Brand */}
        <div className="ecc-header" aria-hidden={collapsed ? "true" : "false"}>
          <div className="ecc-logo" />
          {!collapsed && <div className="ecc-title" title="Empire Command Center">Empire Command Center</div>}
          <button
            className="ecc-pin"
            aria-pressed={collapsed ? "true" : "false"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Icons.ChevronRight size={18} /> : <Icons.ChevronLeft size={18} />}
          </button>
        </div>

        {/* Scrollable nav list (only the list scrolls; flyout is fixed, sibling in body) */}
        <div className="ecc-scroll" role="list">
          {NAV_SECTIONS.map((section: NavParent, idx: number) => {
            const Icon = useIcon(section.icon) || Icons.Folder;
            const parentBadge = section.badgeKey ? badges[section.badgeKey] : undefined;
            const rowRef = React.createRef<HTMLDivElement>();
            const hasChildren = (section.children?.length || 0) > 0;

            const parentActive =
              isActive(section.path) ||
              (hasChildren && section.children!.some((c) => isActive(c.path)));

            const row = (
              <div
                key={`${section.title}-${idx}`}
                className={`ecc-row ${parentActive ? "is-active" : ""}`}
                ref={rowRef}
                onMouseEnter={(e) => rowRef.current && handleParentEnter(e, section, rowRef.current)}
                onMouseLeave={handleParentLeave}
              >
                <div className="ecc-row-inner" role="listitem">
                  <div className="ecc-icon-wrap" aria-hidden="true">
                    <Icon className="ecc-icon" size={20} />
                  </div>

                  {!collapsed && (
                    <>
                      {section.path ? (
                        <Link href={section.path} className="ecc-label" aria-current={parentActive ? "page" : undefined}>
                          {section.title}
                        </Link>
                      ) : (
                        <span className="ecc-label" aria-expanded={parentActive ? "true" : "false"}>
                          {section.title}
                        </span>
                      )}
                      <div className="ecc-spacer" />
                      {typeof parentBadge === "number" && (
                        <span className="ecc-badge" aria-label={`${parentBadge} items`}>{parentBadge}</span>
                      )}
                      {hasChildren && <Icons.ChevronRight className="ecc-caret" size={16} aria-hidden="true" />}
                    </>
                  )}
                </div>

                {/* Inline children shown only when expanded */}
                {!collapsed && hasChildren && (
                  <div className="ecc-children" role="group" aria-label={`${section.title} submenu`}>
                    {section.children!.map((child, i) => {
                      const CIcon = useIcon(child.icon) || Icons.Dot;
                      const childActive = isActive(child.path);
                      const count = child.badgeKey ? badges[child.badgeKey] : undefined;
                      return (
                        <Link
                          href={child.path}
                          key={`${child.title}-${i}`}
                          className={`ecc-child ${childActive ? "is-active" : ""}`}
                          aria-current={childActive ? "page" : undefined}
                        >
                          <CIcon className="ecc-child-icon" size={16} />
                          <span className="ecc-child-label" title={child.title}>{child.title}</span>
                          <div className="ecc-spacer" />
                          {typeof count === "number" && <span className="ecc-badge small">{count}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );

            return row;
          })}
        </div>
      </div>

      {/* Fixed-position flyout, anchored by getBoundingClientRect (only in collapsed mode) */}
      {collapsed && flyRootRef.current && flyOpen && flyItems.length > 0 && (
        <div
          className="ecc-flyout"
          style={flyStyle}
          role="menu"
          aria-label={`${activeParentTitle ?? ""} submenu`}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={handleFlyoutLeave}
        >
          {flyItems.map((child, i) => {
            const CIcon = useIcon(child.icon) || Icons.Dot;
            const count = child.badgeKey ? badges[child.badgeKey] : undefined;
            return (
              <Link href={child.path} key={`${child.title}-${i}`} className="ecc-flyout-item" role="menuitem">
                <CIcon className="ecc-flyout-icon" size={16} />
                <span className="ecc-flyout-label" title={child.title}>{child.title}</span>
                <div className="ecc-spacer" />
                {typeof count === "number" && <span className="ecc-badge small">{count}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
}

// src/components/Sidebar.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import * as Icons from "lucide-react";

/* ---------- Types ---------- */
type NavItem = {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

/* ---------- Single Source of Truth (no external import) ---------- */
const NAV_SECTIONS: NavSection[] = [
  {
    label: "Primary",
    items: [{ label: "Dashboard", path: "/dashboard", icon: "Home" }],
  },

  {
    label: "Managed Assets",
    items: [
      {
        label: "Portfolio", // parent only; children are the actual pages
        icon: "LayoutGrid",
        children: [
          { label: "Properties", path: "/portfolio/properties", icon: "Building2" },
          { label: "Units", path: "/portfolio/units", icon: "House" },
          { label: "Leases", path: "/portfolio/leases", icon: "ScrollText" },
          { label: "Tenants", path: "/portfolio/tenants", icon: "Users" },
          { label: "Owners", path: "/portfolio/owners", icon: "UserSquare2" },
        ],
      },
    ],
  },

  {
    label: "Cards (Entity Hubs)",
    items: [
      {
        label: "Cards",
        icon: "SquareStack",
        children: [
          { label: "Property Card", path: "/card/property/:id", icon: "Box" },
          { label: "Unit Card", path: "/card/unit/:id", icon: "Box" },
          { label: "Lease Card", path: "/card/lease/:id", icon: "Box" },
          { label: "Tenant Card", path: "/card/tenant/:id", icon: "Box" },
          { label: "Owner Card", path: "/card/owner/:id", icon: "Box" },
        ],
      },
    ],
  },

  {
    label: "Operations",
    items: [
      {
        label: "Accounting",
        icon: "Calculator",
        children: [
          { label: "Overview", path: "/ops/accounting/overview", icon: "Gauge" },
          { label: "Rent Collection", path: "/ops/accounting/rent-collection", icon: "Coins" },
          { label: "Expenses", path: "/ops/accounting/expenses", icon: "Receipt" },
          { label: "Financial Reports", path: "/ops/accounting/financial-reports", icon: "LineChart" },
          { label: "Tenant Ledgers", path: "/ops/accounting/tenant-ledgers", icon: "Book" },
          { label: "Collections Dashboard", path: "/ops/accounting/collections-dashboard", icon: "BarChart" },
          { label: "Collections Log", path: "/ops/accounting/collections-log", icon: "ListTree" },
          { label: "Payment Plans", path: "/ops/accounting/payment-plans", icon: "ScrollText" },
          { label: "Deposits", path: "/ops/accounting/deposits", icon: "PiggyBank" },
          { label: "Transfers", path: "/ops/accounting/transfers", icon: "Repeat2" },
          { label: "Subsidized Housing", path: "/ops/accounting/subsidized-housing", icon: "Home" },
          { label: "Assistance Programs", path: "/ops/accounting/assistance-programs", icon: "LifeBuoy" },
        ],
      },
      {
        label: "AI Analytics",
        icon: "Brain",
        children: [
          { label: "Risk Summary", path: "/ops/ai/risk-summary", icon: "ShieldAlert" },
          { label: "Renewal Forecasting", path: "/ops/ai/renewal-forecasting", icon: "CalendarClock" },
          { label: "Vacancy Analytics", path: "/ops/ai/vacancy-analytics", icon: "PieChart" },
          { label: "ML Leasing Logs", path: "/ops/ai/ml-leasing-logs", icon: "ScrollText" },
        ],
      },
      {
        label: "Legal Tracker",
        icon: "Gavel",
        children: [
          { label: "Case Manager", path: "/ops/legal/case-manager", icon: "FolderKanban" },
          { label: "Advanced Legal Ops", path: "/ops/legal/advanced", icon: "PanelTop" },
          { label: "Legal Docs", path: "/ops/legal/docs", icon: "FileText" },
          { label: "Attorney Reports", path: "/ops/legal/attorney-reports", icon: "FileChartColumn" },
        ],
      },
      {
        label: "Maintenance", // renamed from Work Orders
        icon: "Wrench",
        children: [
          { label: "Work Orders", path: "/ops/work/work-orders", icon: "Wrench" },
          { label: "Vendors", path: "/ops/work/vendors", icon: "Truck" },
          { label: "Materials & Inventory", path: "/ops/work/materials-inventory", icon: "Boxes" },
          { label: "Smart Routing", path: "/ops/work/smart-routing", icon: "Route" },
          { label: "AI Intelligence", path: "/ops/work/ai-intelligence", icon: "Sparkles" },
          { label: "Build/Repair Projects", path: "/ops/work/build-repair-projects", icon: "Hammer" },
          { label: "Capital Projects", path: "/ops/work/capital-projects", icon: "LandPlot" },
        ],
      },
      { label: "Reports", path: "/ops/reports", icon: "BarChartBig" },
    ],
  },

  {
    label: "Growth",
    items: [
      { label: "Marketing", path: "/growth/marketing", icon: "Megaphone" },
      // Inventory intentionally lives under Maintenance per your direction.
    ],
  },

  {
    label: "System",
    items: [
      { label: "Automation", path: "/system/automation", icon: "Workflow" },
      { label: "Settings", path: "/system/settings", icon: "Settings" },
    ],
  },

  {
    label: "Data Management",
    items: [
      {
        label: "Data Management",
        icon: "Database",
        children: [
          { label: "Sync Audit", path: "/data/sync-audit", icon: "ClipboardList" },
          { label: "Sync Management", path: "/data/sync-management", icon: "ServerCog" },
          { label: "Raw Data", path: "/data/raw", icon: "Database" },
          { label: "Sync Logs", path: "/data/sync-logs", icon: "BookCopy" },
          { label: "System Settings", path: "/data/system-settings", icon: "SlidersVertical" },
        ],
      },
    ],
  },

  {
    label: "Investor Portal",
    items: [
      {
        label: "Investor Portal",
        icon: "BriefcaseBusiness",
        children: [
          { label: "Dashboard", path: "/investor/dashboard", icon: "LayoutDashboard" },
          { label: "Portfolio Analytics", path: "/investor/portfolio-analytics", icon: "AreaChart" },
          { label: "Financial Reports", path: "/investor/financial-reports", icon: "FileChartLine" },
        ],
      },
    ],
  },

  {
    label: "Integrations",
    items: [
      {
        label: "Integrations",
        icon: "PlugZap",
        children: [
          { label: "Dropbox Files", path: "/integrations/dropbox", icon: "Folder" },
          { label: "CoreLogic / MLS Grid", path: "/integrations/corelogic", icon: "Grid3X3" },
          { label: "Field App Link", path: "/integrations/field-app", icon: "Smartphone" },
          { label: "Deal Room Link", path: "/integrations/deal-room", icon: "Handshake" },
        ],
      },
    ],
  },
];

/* ---------- Icon helper ---------- */
const STORAGE_KEY = "ecc.sidebar.collapsed";
function useIcon(name?: string) {
  return useMemo(() => {
    if (!name) return Icons.Circle;
    const lib: any = Icons;
    return lib[name] ?? Icons.Circle;
  }, [name]);
}
function ItemIcon({ item }: { item: NavItem }) {
  const Ico = useIcon(item.icon);
  return <Ico className="ecc-link__icon" size={18} strokeWidth={1.75} />;
}

/* ---------- Sidebar ---------- */
export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
      document.body.classList.toggle("ecc--sidebar-collapsed", collapsed);
    } catch {}
  }, [collapsed]);

  return (
    <aside className="ecc-sidebar">
      <div className="ecc-sidebar__inner">
        <div className="ecc-sidebar__scroll">
          <Brand collapsed={collapsed} />
          <nav className="ecc-nav">
            {NAV_SECTIONS.map((section) => (
              <Section
                key={section.label}
                section={section}
                collapsed={collapsed}
                activePath={location}
              />
            ))}
          </nav>
        </div>
      </div>

      <button
        className="ecc-collapse-ctl"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((v) => !v)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <Icons.ChevronsRight size={16} /> : <Icons.ChevronsLeft size={16} />}
      </button>
    </aside>
  );
}

/* ---------- Pieces ---------- */
function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="ecc-brand">
      <img
        className="ecc-brand__img"
        src={collapsed ? "/brand/altus-mark.png" : "/brand/altus-logo.png"}
        alt="Altus"
        draggable={false}
      />
    </div>
  );
}

function Section({
  section,
  collapsed,
  activePath,
}: {
  section: NavSection;
  collapsed: boolean;
  activePath: string;
}) {
  return (
    <div className="ecc-section">
      <div className="ecc-section__label">{section.label}</div>
      <ul className="ecc-list">
        {section.items.map((it) => (
          <li key={it.label} className="ecc-list__item">
            {it.children && it.children.length ? (
              <ParentLink item={it} collapsed={collapsed} activePath={activePath} />
            ) : (
              <LeafLink item={it} activePath={activePath} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeafLink({ item, activePath }: { item: NavItem; activePath: string }) {
  const active = item.path && activePath.startsWith(item.path);
  return item.path ? (
    <Link href={item.path} className={`ecc-link ${active ? "is-active" : ""}`}>
      <ItemIcon item={item} />
      <span className="ecc-link__label">{item.label}</span>
    </Link>
  ) : (
    <a className="ecc-link">
      <ItemIcon item={item} />
      <span className="ecc-link__label">{item.label}</span>
    </a>
  );
}

function ParentLink({
  item,
  collapsed,
  activePath,
}: {
  item: NavItem;
  collapsed: boolean;
  activePath: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const anyActive = (item.children ?? []).some(
      (c) => c.path && activePath.startsWith(c.path)
    );
    setOpen(anyActive);
  }, [activePath, item.children]);

  if (collapsed) {
    return (
      <div className="ecc-parent group">
        <button className="ecc-link is-parent" aria-haspopup="true">
          <ItemIcon item={item} />
          <span className="ecc-link__label">{item.label}</span>
          <Icons.ChevronRight className="ecc-link__chev" size={16} />
        </button>
        <div className="ecc-flyout">
          <div className="ecc-flyout__title">
            <ItemIcon item={item} />
            <span>{item.label}</span>
          </div>
          <ul className="ecc-children">
            {(item.children ?? []).map((c) => (
              <li key={c.label}>
                <LeafLink item={c} activePath={activePath} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`ecc-parent ${open ? "is-open" : ""}`}>
      <button
        className="ecc-link is-parent"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ItemIcon item={item} />
        <span className="ecc-link__label">{item.label}</span>
        <Icons.ChevronDown className="ecc-link__chev" size={16} />
      </button>
      <ul className="ecc-children">
        {(item.children ?? []).map((c) => (
          <li key={c.label}>
            <LeafLink item={c} activePath={activePath} />
          </li>
        ))}
      </ul>
    </div>
  );
}

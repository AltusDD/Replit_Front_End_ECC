import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  Home,
  Building2,
  Layers,
  KeyRound,
  Users,
  User,
  FileText,
  Mail,
  ActivitySquare,
  ShieldCheck,
  Wrench,
  BarChart3,
  Settings,
  Database,
  Plug,
  Hammer,
  FolderTree,
  BadgeCheck,
  LineChart,
  ClipboardList,
  Calculator,
  DollarSign,
  Receipt,
  Banknote,
  PieChart,
  FileBarChart,
  TrendingUp,
  Search,
  RotateCcw,
  AlertTriangle,
  HardHat,
  Archive,
  Network,
  UserPlus,
  Download,
  Upload,
  Copy,
  Eye,
  GitBranch,
  Cloud,
  Webhook,
  Cpu,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { NAV, Section, Group, Leaf } from "./navConfig";

const getGroupIcon = (label: string) => {
  const k = label.toLowerCase();
  if (k.includes("dashboard")) return Home;
  if (k.includes("asset")) return Building2;
  if (k.includes("workflow")) return ActivitySquare;
  if (k.includes("operation") && k.includes("accounting")) return Calculator;
  if (k.includes("process")) return KeyRound;
  if (k.includes("operation") && k.includes("maintenance")) return Wrench;
  if (k.includes("legal")) return ShieldCheck;
  if (k.includes("management")) return Users;
  if (k.includes("pipeline")) return TrendingUp;
  if (k.includes("admin")) return Settings;
  if (k.includes("management") && k.includes("data")) return Database;
  if (k.includes("portal")) return Eye;
  if (k.includes("connection")) return Plug;
  if (k.includes("system")) return Cpu;
  return FolderTree;
};

const getLeafIcon = (label: string) => {
  const k = label.toLowerCase();
  if (k.includes("dashboard")) return Home;
  if (k.includes("properties")) return Building2;
  if (k.includes("units")) return Layers;
  if (k.includes("leases")) return KeyRound;
  if (k.includes("tenants")) return Users;
  if (k.includes("owners")) return User;
  if (k.includes("inbox")) return Mail;
  if (k.includes("tasks")) return ClipboardList;
  if (k.includes("opportunities")) return TrendingUp;
  if (k.includes("anomalies")) return AlertTriangle;
  if (k.includes("next best")) return ActivitySquare;
  if (k.includes("ar")) return Calculator;
  if (k.includes("ap")) return Receipt;
  if (k.includes("gl")) return FileBarChart;
  if (k.includes("banking")) return Banknote;
  if (k.includes("close")) return Archive;
  if (k.includes("reporting")) return LineChart;
  if (k.includes("budgets")) return PieChart;
  if (k.includes("taxes")) return DollarSign;
  if (k.includes("vendors")) return Users;
  if (k.includes("receipts")) return Receipt;
  if (k.includes("allocations")) return Layers;
  if (k.includes("audit")) return Search;
  if (k.includes("applications")) return FileText;
  if (k.includes("screening")) return Search;
  if (k.includes("renewals")) return RotateCcw;
  if (k.includes("move")) return Users;
  if (k.includes("delinquencies")) return AlertTriangle;
  if (k.includes("work orders")) return Wrench;
  if (k.includes("turns")) return RotateCcw;
  if (k.includes("capex")) return HardHat;
  if (k.includes("docs")) return FileText;
  if (k.includes("inspections")) return Search;
  if (k.includes("insurance")) return ShieldCheck;
  if (k.includes("licenses")) return BadgeCheck;
  if (k.includes("directory")) return Network;
  if (k.includes("onboarding")) return UserPlus;
  if (k.includes("scorecards")) return BarChart3;
  if (k.includes("acquisitions")) return Building2;
  if (k.includes("marketing")) return TrendingUp;
  if (k.includes("settings")) return Settings;
  if (k.includes("users")) return Users;
  if (k.includes("imports")) return Download;
  if (k.includes("exports")) return Upload;
  if (k.includes("dedupe")) return Copy;
  if (k.includes("archives")) return Archive;
  if (k.includes("audit logs")) return FileBarChart;
  if (k.includes("overview")) return Eye;
  if (k.includes("distributions")) return Banknote;
  if (k.includes("statements")) return FileBarChart;
  if (k.includes("doorloop")) return GitBranch;
  if (k.includes("quickbooks")) return Calculator;
  if (k.includes("azure")) return Cloud;
  if (k.includes("webhooks")) return Webhook;
  if (k.includes("api probe")) return Cpu;
  return FileText;
};

function LeafLink({ leaf }: { leaf: Leaf }) {
  const [isActive] = useRoute(leaf.path);
  const Icon = getLeafIcon(leaf.label);
  return (
    <li className={`leaf ${isActive ? "active" : ""}`}>
      <Link href={leaf.path} title={leaf.label} className={isActive ? "active" : ""}>
        <Icon size={18} color="#F7C948" />
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

function GroupBlock({ grp }: { grp: Group }) {
  const [open, setOpen] = useState(false);
  const Icon = getGroupIcon(grp.label);
  
  return (
    <div className="group">
      <button className="groupBtn" onClick={() => setOpen(!open)}>
        <Icon size={18} color="#F7C948" />
        <span className="lbl">{grp.label}</span>
        <span className="toggle-icon">
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {open && (
        <ul className="leafList">
          {grp.items.map((leaf, i) => (
            <LeafLink key={leaf.label + i} leaf={leaf} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SectionBlock({ sec }: { sec: Section }) {
  return (
    <div className="section">
      {sec.groups.map((g, i) => (
        <GroupBlock key={g.label + i} grp={g} />
      ))}
    </div>
  );
}

export default function Nav() {
  const [pinned, setPinned] = useState(true);
  const [collapsedLevel, setCollapsedLevel] = useState<"none" | "partial" | "full">("none");
  
  // Dynamic icon sizing for consistent layout
  useEffect(() => {
    const updateIconSize = () => {
      const firstIcon = document.querySelector(".leaf svg");
      if (firstIcon) {
        const iconWidth = (firstIcon as HTMLElement).offsetWidth;
        document.documentElement.style.setProperty("--sidebar-icon-size", `${iconWidth}px`);
        document.documentElement.style.setProperty("--collapsed-width", `${iconWidth + 16}px`);
      }
    };
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, [pinned]);
  
  useEffect(() => {
    const checkCollapse = () => {
      const width = window.innerWidth;
      const layout = document.querySelector('.layout');
      if (width < 640) {
        layout?.classList.add('collapsed-full');
        layout?.classList.remove('collapsed-partial');
        setCollapsedLevel("full");
      } else if (width < 900) {
        layout?.classList.add('collapsed-partial');
        layout?.classList.remove('collapsed-full');
        setCollapsedLevel("partial");
      } else {
        layout?.classList.remove('collapsed-full', 'collapsed-partial');
        setCollapsedLevel("none");
      }
    };
    window.addEventListener('resize', checkCollapse);
    checkCollapse();
    return () => window.removeEventListener('resize', checkCollapse);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("ecc.sidebarPinned");
    if (raw != null) setPinned(raw === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("ecc.sidebarPinned", pinned ? "1" : "0");
    document.querySelector(".layout")?.classList.toggle("collapsed", !pinned);
    document.querySelector(".sidebar")?.classList.toggle("collapsed", !pinned);
  }, [pinned]);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="brand">
          <img src="/logo.png" className="brandLogo" alt="Altus Realty Group" />
        </div>
        <nav className="nav-sections">
          {NAV.map((s, i) => (
            <SectionBlock key={s.label + i} sec={s} />
          ))}
        </nav>
      </div>
      <div className="pinRow">
        <button className="pinBtn" onClick={() => setPinned((v) => !v)}>
          {pinned ? "Pin ▣" : "Unpin ◻︎"}
        </button>
      </div>
    </aside>
  );
}
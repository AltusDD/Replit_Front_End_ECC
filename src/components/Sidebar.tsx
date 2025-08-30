import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import NAV, { Section, Group, Leaf } from "@/lib/navConfig";
import {
  Home, Building2, Layers, KeyRound, Users, User, Settings, Folder,
  FileText, Calculator, TrendingUp, Database, PieChart, Zap, Wrench,
  ChevronDown, ChevronRight
} from "lucide-react";

const iconMap: Record<string, any> = {
  dashboard: Home,
  home: Home,
  portfolio: Building2,
  properties: Building2,
  units: Layers,
  leases: KeyRound,
  tenants: Users,
  owners: User,
  cards: FileText,
  operations: Calculator,
  accounting: Calculator,
  leasing: KeyRound,
  maintenance: Wrench,
  compliance: FileText,
  vendors: Users,
  growth: TrendingUp,
  system: Settings,
  settings: Settings,
  data: Database,
  investor: PieChart,
  integrations: Zap,
  tools: Wrench,
};

const iconFor = (label: string) => {
  const key = label.toLowerCase();
  for (const k in iconMap) if (key.includes(k)) return iconMap[k];
  return Folder;
};

function SectionBlock({ sec }: { sec: Section }) {
  return (
    <div className="section">
      {sec.groups.map((g, i) => (
        <GroupBlock key={g.label + i} grp={g} />
      ))}
    </div>
  );
}

function GroupBlock({ grp }: { grp: Group }) {
  const [open, setOpen] = useState(false);
  const Icon = iconFor(grp.label);
  
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

function LeafLink({ leaf }: { leaf: Leaf }) {
  const [loc] = useLocation();
  const isActive = loc === leaf.path;
  const Icon = iconFor(leaf.label);
  return (
    <li className={`leaf ${isActive ? "active" : ""}`}>
      <Link href={leaf.path} className={isActive ? "active" : ""}>
        <Icon size={18} color="#F7C948" />
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

export default function Nav() {
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("ecc.sidebarPinned");
    if (raw != null) setPinned(raw === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("ecc.sidebarPinned", pinned ? "1" : "0");
    const layout = document.querySelector(".layout");
    const sidebar = document.querySelector(".sidebar");
    layout?.classList.toggle("collapsed", !pinned);
    sidebar?.classList.toggle("collapsed", !pinned);
  }, [pinned]);

  return (
    <aside className="sidebar">
      <div className="pinRow">
        <button className="pinBtn" onClick={() => setPinned((v) => !v)}>
          {pinned ? "Pin ▣" : "Unpin ◻︎"}
        </button>
      </div>
      <div className="brand">
        <img src="/logo.png" className="logo" alt="Altus Realty" />
        <div className="title">Empire Command Center</div>
      </div>
      {NAV.map((s, i) => <SectionBlock key={s.label + i} sec={s} />)}
    </aside>
  );
}
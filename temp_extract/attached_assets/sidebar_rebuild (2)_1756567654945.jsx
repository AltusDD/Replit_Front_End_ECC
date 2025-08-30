// Updated Nav.tsx (logo fix, icon colors, active page indicator)

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
  Tool,
  FolderTree,
  BadgeCheck,
  LineChart,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { NAV, Section, Group, Leaf } from "./navConfig";

const iconFor = (label: string) => {
  const k = label.toLowerCase();
  if (k.includes("dashboard")) return Home;
  if (k.includes("portfolio")) return Building2;
  if (k.includes("units") || k.includes("allocations")) return Layers;
  if (k.includes("lease")) return KeyRound;
  if (k.includes("tenants")) return Users;
  if (k.includes("owner") || k.includes("vendors")) return User;
  if (k.includes("compliance")) return ShieldCheck;
  if (k.includes("maintenance")) return Wrench;
  if (k.includes("growth") || k.includes("marketing")) return BarChart3;
  if (k.includes("settings") || k.includes("system")) return Settings;
  if (k.includes("data")) return Database;
  if (k.includes("integration") || k.includes("webhook")) return Plug;
  if (k.includes("tools") || k.includes("api")) return Tool;
  if (k.includes("cards") || k.includes("inbox") || k.includes("tasks")) return ActivitySquare;
  if (k.includes("screening") || k.includes("applications")) return ClipboardList;
  if (k.includes("insurance") || k.includes("licenses")) return BadgeCheck;
  return FolderTree;
};

function LeafLink({ leaf }: { leaf: Leaf }) {
  const [loc] = useLocation();
  const active = loc === leaf.path;
  const Icon = iconFor(leaf.label);
  return (
    <li className={`leaf ${active ? "active" : ""}`}>
      <Link href={leaf.path} title={leaf.label}>
        <Icon size={18} color="#F7C948" />
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

function GroupBlock({ grp }: { grp: Group }) {
  return (
    <div className="group">
      <button className="groupBtn">
        {iconFor(grp.label)({ size: 18, color: "#F7C948" })}
        <span className="lbl">{grp.label}</span>
      </button>
      <ul className="leafList">
        {grp.items.map((leaf, i) => (
          <LeafLink key={leaf.label + i} leaf={leaf} />
        ))}
      </ul>
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
      <div className="pinRow">
        <button className="pinBtn" onClick={() => setPinned((v) => !v)}>
          {pinned ? "Pin ▣" : "Unpin ◻︎"}
        </button>
      </div>
      <div className="brand">
        <img src="/logo.png" className="brandLogo" alt="Altus Realty Group" />
        <div className="title">Empire Command Center</div>
      </div>
      {NAV.map((s, i) => (
        <SectionBlock key={s.label + i} sec={s} />
      ))}
    </aside>
  );
}

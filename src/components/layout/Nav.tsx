import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Folder,
  Building2,
  LayoutDashboard,
  ListTodo,
  FileText,
  ShieldCheck,
  Settings,
  Users,
  Database,
  Plug,
  Wrench
} from "lucide-react";
import { NAV, Section, Group, Leaf } from "./navConfig";

const iconFor = (label: string) => {
  const k = label.toLowerCase();
  if (k.includes("primary")) return LayoutDashboard;
  if (k.includes("portfolio")) return Building2;
  if (k.includes("cards")) return ListTodo;
  if (k.includes("operations")) return FileText;
  if (k.includes("compliance")) return ShieldCheck;
  if (k.includes("system")) return Settings;
  if (k.includes("vendor")) return Users;
  if (k.includes("data")) return Database;
  if (k.includes("integration")) return Plug;
  if (k.includes("tools")) return Wrench;
  return Folder;
};

function LeafLink({ leaf }: { leaf: Leaf }) {
  const [loc] = useLocation();
  const active = loc === leaf.path;
  return (
    <li className="leaf">
      <Link href={leaf.path} className={active ? "active" : ""} title={leaf.label}>
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

function GroupBlock({ grp }: { grp: Group }) {
  const [open, setOpen] = useState(false);
  const Icon = iconFor(grp.label);
  return (
    <li className="group">
      <button className="groupBtn" onClick={() => setOpen(!open)}>
        <Icon size={16} />
        <span className="lbl">{grp.label}</span>
      </button>
      {open && <ul className="leafList">{grp.items.map((l, i) => <LeafLink key={i} leaf={l} />)}</ul>}
    </li>
  );
}

function SectionBlock({ sec }: { sec: Section }) {
  return (
    <div className="section">
      <ul className="groupList">{sec.groups.map((g, i) => <GroupBlock key={i} grp={g} />)}</ul>
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
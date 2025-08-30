// src/components/layout/Nav.tsx
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

// CSS styles to enable collapse, flyout, spacing, branding
// Add to src/styles/theme.css:

/* Layout collapse */
.layout.collapsed {
  grid-template-columns: 64px 1fr;
}

.sidebar {
  background: var(--panel-3);
  border-right: 1px solid var(--border);
  padding: 16px 10px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  transition: width 0.2s ease;
}

.sidebar.collapsed {
  padding: 12px 6px;
}

.sidebar.collapsed:hover {
  width: var(--sidebar-w);
}

.layout.collapsed .sidebar:hover .title,
.layout.collapsed .sidebar:hover .lbl {
  display: inline;
}

.layout.collapsed .sidebar:hover .nav a {
  justify-content: flex-start;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 18px 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 10px;
}

.logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 6px;
}

.sidebar:not(.collapsed) .logo {
  width: 36px;
  height: auto;
}

.pinRow {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.pinBtn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.pinBtn:hover {
  border-color: var(--gold-700);
  color: var(--text);
}

.groupBtn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text);
}

.groupBtn:hover {
  background: var(--panel-2);
}

.leafList {
  padding-left: 12px;
  list-style: none;
}

.leaf .lbl {
  white-space: nowrap;
}

.sidebar.collapsed .leaf .lbl,
.sidebar.collapsed .groupBtn .lbl,
.sidebar.collapsed .title {
  display: none;
}

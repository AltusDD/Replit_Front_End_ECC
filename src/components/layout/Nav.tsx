import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { 
  Home, Building2, Users, FileText, UserCheck, Crown,
  Inbox, CheckSquare, TrendingUp, AlertTriangle, Zap,
  Calculator, CreditCard, Landmark, Building, FileBarChart,
  Receipt, PieChart, DollarSign, Archive, ShieldCheck,
  Hammer, RotateCcw, HardHat, Wrench,
  FileCheck, Search, Shield, CreditCard as Insurance,
  Network, UserPlus, BarChart3,
  ShoppingCart, Megaphone,
  Settings, UserCog,
  Download, Upload, Copy, Archive as ArchiveIcon, FileSearch,
  Eye, Banknote, FileBarChart as Statements,
  GitBranch, Calculator as QuickBooks, Cloud, Webhook,
  Cpu, Pin, PinOff
} from "lucide-react";
import { NAV, Section, Group, Leaf } from "./navConfig";

// Icon mapping for navigation labels
const getIcon = (label: string) => {
  const iconMap: Record<string, any> = {
    // Primary
    'Dashboard': Home,
    
    // Portfolio V3
    'Properties': Building2,
    'Units': Building,
    'Leases': FileText,
    'Tenants': Users,
    'Owners': Crown,
    
    // Cards
    'Inbox': Inbox,
    'Tasks': CheckSquare,
    'Opportunities': TrendingUp,
    'Anomalies': AlertTriangle,
    'Next Best Action': Zap,
    
    // Operations - Accounting
    'AR': Calculator,
    'AP': CreditCard,
    'GL': Landmark,
    'Banking': Building,
    'Close': FileBarChart,
    'Reporting': Receipt,
    'Budgets': PieChart,
    'Taxes': DollarSign,
    'Vendors': Archive,
    'Receipts': Receipt,
    'Allocations': ShieldCheck,
    'Audit Trail': Archive,
    
    // Operations - Leasing
    'Applications': FileText,
    'Screening': Search,
    'Renewals': RotateCcw,
    'Move-in/Move-out': Users,
    'Delinquencies': AlertTriangle,
    
    // Operations - Maintenance
    'Work Orders': Hammer,
    'Turns': RotateCcw,
    'CapEx': HardHat,
    
    // Operations - Compliance
    'Docs': FileCheck,
    'Inspections': Search,
    'Insurance': Shield,
    'Licenses': ShieldCheck,
    
    // Operations - Vendors
    'Directory': Network,
    'Onboarding': UserPlus,
    'Scorecards': BarChart3,
    
    // Growth
    'Acquisitions': ShoppingCart,
    'Marketing': Megaphone,
    
    // System
    'Settings': Settings,
    'Users & Roles': UserCog,
    
    // Data Management
    'Imports': Download,
    'Exports': Upload,
    'Dedupe': Copy,
    'Archives': ArchiveIcon,
    'Audit Logs': FileSearch,
    
    // Investor Portal
    'Overview': Eye,
    'Distributions': Banknote,
    'Statements': Statements,
    
    // Integrations
    'DoorLoop': GitBranch,
    'QuickBooks': QuickBooks,
    'Azure': Cloud,
    'Webhooks': Webhook,
    
    // Tools
    'API Probe': Cpu
  };
  
  const IconComponent = iconMap[label] || FileText;
  return <IconComponent className="nav-icon" />;
};

function LeafLink({leaf, collapsed}:{leaf:Leaf, collapsed:boolean}) {
  const [loc] = useLocation();
  const active = loc === leaf.path;
  return (
    <li className="leaf">
      <Link href={leaf.path} className={active ? "active" : ""}>
        {getIcon(leaf.label)}
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

function RenderItem({item, collapsed}: {item: Leaf | Group, collapsed: boolean}) {
  if ('path' in item) return <LeafLink leaf={item} collapsed={collapsed} />;
  return (
    <li className="group">
      <div className="gH">{item.label}</div>
      <ul className="nav">
        {item.children.map((c) => <LeafLink key={c.path} leaf={c} collapsed={collapsed} />)}
      </ul>
    </li>
  );
}

function SectionBlock({sec, collapsed}:{sec:Section, collapsed:boolean}) {
  return (
    <div className="navSec">
      <div className="secH">{sec.label}</div>
      <ul className="nav">
        {sec.items.map((it, i) => 
          <div key={i+(('path'in it)?it.path:it.label)}>
            <RenderItem item={it} collapsed={collapsed} />
          </div>
        )}
      </ul>
    </div>
  );
}

export default function Nav(){
  const [pinned, setPinned] = useState(true);
  
  useEffect(() => {
    const saved = localStorage.getItem('ecc.sidebarPinned');
    if (saved !== null) {
      setPinned(JSON.parse(saved));
    }
  }, []);
  
  const togglePin = () => {
    const newPinned = !pinned;
    setPinned(newPinned);
    localStorage.setItem('ecc.sidebarPinned', JSON.stringify(newPinned));
    
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new CustomEvent('ecc:pinChanged', { 
      detail: { pinned: newPinned } 
    }));
  };

  return (
    <aside className={`sidebar ${!pinned ? 'collapsed' : ''}`}>
      <button className={`pin-btn ${pinned ? 'pinned' : ''}`} onClick={togglePin}>
        {pinned ? <Pin size={14} /> : <PinOff size={14} />}
      </button>
      
      <div className="brand">
        <img src="/logo.png" className="logo" alt="Altus Realty" />
        <div className="title">Empire Command Center</div>
      </div>
      
      {NAV.map((sec, i) => 
        <SectionBlock key={sec.label+i} sec={sec} collapsed={!pinned} />
      )}
    </aside>
  );
}
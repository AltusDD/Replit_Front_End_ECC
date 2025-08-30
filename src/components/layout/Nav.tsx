import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { 
  Home, Building2, Inbox, Briefcase, TrendingUp, Settings, Database, Eye, Network, Cpu,
  Calculator, FileText, Hammer, Shield, Archive,
  Pin, PinOff, ChevronDown, ChevronRight
} from "lucide-react";
import { NAV, Section, Group, Leaf } from "./navConfig";

// Icon mapping for Sections and Groups only
const getSectionIcon = (label: string) => {
  const iconMap: Record<string, any> = {
    'Primary': Home,
    'Portfolio V3': Building2,
    'Cards': Inbox,
    'Operations': Briefcase,
    'Growth': TrendingUp,
    'System': Settings,
    'Data Management': Database,
    'Investor Portal': Eye,
    'Integrations': Network,
    'Tools': Cpu
  };
  
  const IconComponent = iconMap[label] || Briefcase;
  return <IconComponent className="nav-icon" />;
};

const getGroupIcon = (label: string) => {
  const iconMap: Record<string, any> = {
    'Accounting': Calculator,
    'Leasing': FileText,
    'Maintenance': Hammer,
    'Compliance': Shield,
    'Vendors': Archive
  };
  
  const IconComponent = iconMap[label] || Briefcase;
  return <IconComponent className="nav-icon" />;
};

function LeafLink({leaf}: {leaf: Leaf}) {
  const [loc] = useLocation();
  const active = loc === leaf.path;
  return (
    <li className="leaf">
      <Link href={leaf.path} className={active ? "active" : ""}>
        <span className="lbl">{leaf.label}</span>
      </Link>
    </li>
  );
}

function GroupItem({
  group, 
  sectionId, 
  openGroups, 
  toggleGroup, 
  collapsed
}: {
  group: Group;
  sectionId: string;
  openGroups: Record<string, string | null>;
  toggleGroup: (sectionId: string, groupLabel: string) => void;
  collapsed: boolean;
}) {
  const groupId = `${sectionId}-${group.label}`;
  const isOpen = openGroups[sectionId] === group.label;
  
  return (
    <li className="group">
      <button 
        className="group-toggle" 
        onClick={() => toggleGroup(sectionId, group.label)}
      >
        {getGroupIcon(group.label)}
        <span className="lbl">{group.label}</span>
        {!collapsed && (
          <span className="toggle-icon">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
      </button>
      
      {isOpen && (
        <ul className="group-children">
          {group.children.map((child) => (
            <LeafLink key={child.path} leaf={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SectionBlock({
  sec, 
  collapsed, 
  openGroups, 
  toggleGroup
}: {
  sec: Section;
  collapsed: boolean;
  openGroups: Record<string, string | null>;
  toggleGroup: (sectionId: string, groupLabel: string) => void;
}) {
  const sectionId = sec.label.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <div className="nav-section">
      <div className="section-header">
        {getSectionIcon(sec.label)}
        <span className="lbl">{sec.label}</span>
      </div>
      
      <ul className="section-items">
        {sec.items.map((item, i) => {
          if ('path' in item) {
            // Direct leaf item
            return <LeafLink key={item.path} leaf={item} />;
          } else {
            // Group item
            return (
              <GroupItem
                key={item.label}
                group={item}
                sectionId={sectionId}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
                collapsed={collapsed}
              />
            );
          }
        })}
      </ul>
    </div>
  );
}

export default function Nav() {
  const [pinned, setPinned] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, string | null>>({});
  
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
  
  const toggleGroup = (sectionId: string, groupLabel: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === groupLabel ? null : groupLabel
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
      
      <div className="nav-content">
        {NAV.map((sec) => (
          <SectionBlock
            key={sec.label}
            sec={sec}
            collapsed={!pinned}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
          />
        ))}
      </div>
    </aside>
  );
}
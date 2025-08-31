import React,{useEffect,useMemo,useState} from "react";
import { Link, useLocation } from "wouter";
import NAV,{Section,Group,Leaf} from "@/lib/navConfig";
import {
  Home, LayoutDashboard, Building2, Layers, KeyRound, Users, User,
  FileText, Calculator, TrendingUp, Wrench, Database, PieChart, Bot, Gavel,
  ClipboardList, FolderKanban, ListChecks, Repeat2, ClipboardCheck, Megaphone,
  Store, ChevronDown, ChevronRight
} from "lucide-react";

const mapIcon = (label:string) => {
  const k = label.toLowerCase().replace(/\s+/g,"");
  return (
    k==="home" || k==="dashboard" ? Home :
    k==="portfolio" ? LayoutDashboard :
    k==="properties" ? Building2 :
    k==="units" ? Layers :
    k==="leases" ? KeyRound :
    k==="tenants" ? Users :
    k==="owners" ? User :
    k==="cards" || k==="documents" ? FileText :
    k==="accounting" ? Calculator :
    k==="marketing" ? TrendingUp :
    k==="tools" || k==="probe" ? Wrench :
    k==="data" ? Database :
    k==="analytics" ? PieChart :
    k==="ai" || k==="aiintelligence" || k==="insights" ? Bot :
    k==="legal" || k==="compliance" ? Gavel :
    k==="tasks" ? ClipboardList :
    k==="projects" ? FolderKanban :
    k==="sprints" ? Repeat2 :
    k==="backlog" ? ListChecks :
    k==="workorders" || k==="work-orders" ? ClipboardCheck :
    k==="listings" || k==="leads" || k==="campaigns" ? Megaphone :
    k==="vendors" || k==="banking" || k==="store" ? Store :
    FileText
  );
};

export default function Sidebar(){
  const [loc] = useLocation();
  const [collapsed,setCollapsed]=useState<boolean>(()=>{ try{return localStorage.getItem("nav:collapsed")==="1"}catch{return false}});
  useEffect(()=>{ try{localStorage.setItem("nav:collapsed",collapsed?"1":"0")}catch{} },[collapsed]);

  // figure out which group contains the active route so we can auto-open it
  const activeGroupKey = useMemo(()=>{
    for(const section of NAV){
      for(const g of section.groups){
        for(const leaf of (g.items||[])){
          if (leaf.path === loc) return `${section.label}/${g.label}`;
        }
      }
    }
    return "";
  },[loc]);

  const [open,setOpen]=useState<Record<string,boolean>>(()=>{try{return JSON.parse(localStorage.getItem("nav:open")||"{}")}catch{return{}}});
  useEffect(()=>{
    if (activeGroupKey && !open[activeGroupKey]) {
      setOpen(s=>({...s, [activeGroupKey]: true}));
    }
  },[activeGroupKey]); // auto-open once when route changes
  useEffect(()=>{ try{localStorage.setItem("nav:open",JSON.stringify(open))}catch{} },[open]);

  const toggle=(k:string)=>setOpen(s=>({...s,[k]:!s[k]}));

  return(
    <aside className={`sidebar ${collapsed?"collapsed":""}`} data-ecc="sidebar">
      <div className="brand">
        <div className="logo"><img src="/logo.png" alt="Altus" /></div>
        {/* no title text */}
        <button className="pinBtn" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?"Unpin":"Pin"}>
          {collapsed?"»":"«"}
        </button>
      </div>

      <nav className="nav">
        {NAV.map((section:Section)=>(
          <div className="section" key={section.label}>
            <div className="group-label">{section.label}</div>
            {section.groups.map((g:Group)=>{
              const key=`${section.label}/${g.label}`;
              const has=g.items?.length>0; const isOpen=!!open[key] || !has;
              const GroupIcon = mapIcon(g.label);
              return (
                <div className="group" key={key}>
                  <button className="group-row" data-tip={g.label} onClick={()=> has && toggle(key)}>
                    <GroupIcon size={16} className="icon" />
                    <span className="lbl">{g.label}</span>
                    {has ? <span className="expand">{isOpen?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</span> : null}
                  </button>

                  {/* In collapsed mode we still render the children as ICONS so users can see where they are */}
                  {has && (
                    <div className={`leafList ${isOpen?"open":""}`}>
                      {g.items.map((leaf:Leaf)=>{
                        const active=loc===leaf.path;
                        const LeafIcon = mapIcon(leaf.label);
                        return (
                          <Link href={leaf.path} key={leaf.path}>
                            <a className={`leaf ${active?"active":""}`} aria-current={active?"page":undefined} data-tip={leaf.label}>
                              <LeafIcon size={14} className="icon" />
                              <span className="lbl">{leaf.label}</span>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="pinBtn" onClick={()=>setCollapsed(!collapsed)}>{collapsed?"Unpin":"Pin"}</button>
      </div>
    </aside>
  );
}
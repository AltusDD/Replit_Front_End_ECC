import React, { useEffect, useMemo, useState } from "react";

type Props = { table:"properties"|"units"|"leases"|"tenants"|"owners"; refId:string|number };

type EventRow = { id?:number; created_at?:string; event_type?:string; label?:string; source?:string; payload?:any };

async function getJSON(url:string){
  const r = await fetch(url);
  if (!r.ok) return { ok:false, status:r.status };
  try { return await r.json(); } catch { return { ok:true, items:[] }; }
}

export default function ActivityFeed({ table, refId }: Props){
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState<string>("all");
  const [from, setFrom] = useState<string>(""); // yyyy-mm-dd
  const [to, setTo] = useState<string>("");

  useEffect(()=>{ (async()=>{
    setLoading(true);
    try{
      // primary endpoint
      let j:any = await getJSON(`/api/audit/by-ref?table=${encodeURIComponent(table)}&ref_id=${encodeURIComponent(refId)}`);
      // tolerate 404 or legacy shapes
      const list:EventRow[] = (j?.items || j?.events || j?.data || (Array.isArray(j)?j:[])) as EventRow[];
      setRows(Array.isArray(list) ? list : []);
    } finally { setLoading(false); }
  })(); }, [table, refId]);

  const filtered = useMemo(()=>{
    return rows.filter(r=>{
      if (src !== "all" && (r.source||"").toLowerCase() !== src) return false;
      const d = r.created_at ? new Date(r.created_at) : null;
      if (from && d && d < new Date(from)) return false;
      if (to && d && d > new Date(to+"T23:59:59")) return false;
      return true;
    });
  }, [rows, src, from, to]);

  return (
    <div className="card">
      <div className="card-head">
        <div className="ecc-section-title">Activity</div>
        <div style={{fontSize:12, color:"#9a9aa2"}}>{rows.length ? `${rows.length} events` : ""}</div>
      </div>

      <div className="filter">
        <select className="select" value={src} onChange={e=>setSrc(e.target.value)}>
          <option value="all">All sources</option>
          <option value="doorloop">DoorLoop</option>
          <option value="system">System</option>
          <option value="m365">M365</option>
          <option value="corelogic">CoreLogic</option>
        </select>
        <input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} />
      </div>

      <div className="timeline">
        {loading ? (
          <div className="text-sm text-neutral-400">Loading activity…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-neutral-400">No events.</div>
        ) : filtered.map((ev, i)=>(
          <div key={ev.id || i} className={`ecc-chip ${String(ev.event_type||"").includes("LEGAL") ? "danger" : ""}`}>
            <span>{iconFor(ev)}</span>
            <div className="text-[13px]">
              <div className="font-medium">{titleFor(ev)}</div>
              {ev.label ? <div className="text-neutral-400 text-[12px]">{ev.label}</div> : null}
            </div>
            <div className="meta">{ev.created_at ? new Date(ev.created_at).toLocaleString() : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function titleFor(ev:EventRow){
  if (ev.event_type) return ev.event_type.replace(/_/g," ").toLowerCase().replace(/\b\w/g, c=>c.toUpperCase());
  return "Event";
}
function iconFor(ev:EventRow){
  const s=(ev.source||"").toLowerCase();
  if (s==="doorloop") return "🏷️";
  if (s==="system") return "⚙️";
  if (s==="m365") return "📧";
  if (s==="corelogic") return "🧭";
  return "•";
}
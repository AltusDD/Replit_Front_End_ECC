import React, { useState, useRef, useEffect } from "react";

export default function ActionMenu({ onSelect }: { onSelect?: (key:string)=>void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h = (e:MouseEvent)=>{ if(!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return ()=>document.removeEventListener("mousedown", h);
  },[]);
  const click = (key:string)=>{ onSelect?.(key); setOpen(false); };

  return (
    <div className="ecc-row-actions" ref={ref}>
      <button className="ecc-actions-trigger" aria-label="Row actions" onClick={()=>setOpen(v=>!v)}>⋯</button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'var(--surface-2)',
          border: '1px solid var(--line-1)',
          borderRadius: '8px',
          padding: '4px',
          zIndex: 10,
          minWidth: '120px'
        }}>
          <button className="ecc-btn" style={{width: '100%', margin: '2px 0'}} onClick={()=>click("view")}>View Details</button>
          <button className="ecc-btn" style={{width: '100%', margin: '2px 0'}} onClick={()=>click("edit")}>Edit</button>
          <button className="ecc-btn" style={{width: '100%', margin: '2px 0'}} onClick={()=>click("report")}>Generate Report</button>
        </div>
      )}
    </div>
  );
}
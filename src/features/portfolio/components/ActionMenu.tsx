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
    <div className="relative" ref={ref}>
      <button className="ecc-btn" aria-label="Row actions" onClick={()=>setOpen(v=>!v)}>⋯</button>
      {open && (
        <div className="ecc-menu">
          <button onClick={()=>click("view")}>View Details</button>
          <button onClick={()=>click("edit")}>Edit</button>
          <button onClick={()=>click("report")}>Generate Report</button>
        </div>
      )}
    </div>
  );
}
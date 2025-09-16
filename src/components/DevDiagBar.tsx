import React, { useEffect, useState } from "react";

export default function DevDiagBar() {
  const [err,setErr] = useState<any>(null);
  useEffect(()=>{
    const t = setInterval(()=>{
      const e = (window as any).__ECC_LAST_ERROR__;
      if (e !== err) setErr(e);
    }, 500);
    return ()=>clearInterval(t);
  }, [err]);
  if (!import.meta.env.DEV || !err) return null;
  return (
    <div style={{ position:"fixed", top:6, left:6, zIndex: 1, fontSize:12, padding:"6px 8px",
      background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8 }}>
      <div style={{ fontWeight:700 }}>DEV ERROR</div>
      <div style={{ maxWidth: 560, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
        {String(err?.error?.message ?? err?.error ?? "(unknown)")}
      </div>
    </div>
  );
}
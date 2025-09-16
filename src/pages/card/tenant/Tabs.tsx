import React from 'react';
// ECC Guardrail compliance
export type TenantTabKey = 'overview'|'details'|'financials'|'legal'|'files'|'linked'|'activity';
export interface TabDef { key: TenantTabKey; label: string; content: React.ReactNode; }
export default function TenantTabs({tabs, defaultKey='overview'}:{tabs:TabDef[];defaultKey?:TenantTabKey;}){
  const [active,setActive]=React.useState<TenantTabKey>(defaultKey);
  return (
    <div className="ecc-object">
      <nav className="flex gap-2 mb-3">
        {tabs.map(t=>(
          <button key={t.key} className={`px-3 py-1.5 rounded ${active===t.key?'bg-white/10':'hover:bg-white/5'}`} onClick={()=>setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      <div>{tabs.find(t=>t.key===active)?.content}</div>
    </div>
  );
}
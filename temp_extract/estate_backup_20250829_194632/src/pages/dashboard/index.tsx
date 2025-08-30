import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { fetchCollection, fetchJSON } from '@lib/useApi';

export default function Dashboard(){
  const [counts,setCounts]=useState<Record<string,number>>({});
  const [rpcOk,setRpcOk]=useState(false);
  useEffect(()=>{(async()=>{
    const names=['properties','units','leases','tenants','owners'];
    const results=await Promise.all(names.map(n=>fetchCollection(n).catch(()=>({items:[]}))));
    const c:Record<string,number>={}; names.forEach((n,i)=>c[n]=(results[i].items as any[]).length); setCounts(c);
    try{await fetchJSON('rpc/dashboard_kpis'); setRpcOk(true);}catch{setRpcOk(false);}
  })()},[]);
  const cards=[{title:'Properties',key:'properties'},{title:'Units',key:'units'},{title:'Leases',key:'leases'},{title:'Tenants',key:'tenants'},{title:'Owners',key:'owners'}];
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="kpis">
        {cards.map(c=><StatCard key={c.key} title={c.title} value={counts[c.key]??'…'}/>)}
      </div>
      <div className="section">
        <div className="row">
          <strong>Next Best Action</strong>
          {rpcOk ? <Badge tone="info">Powered by RPC</Badge> : <Badge tone="neutral">Not available yet</Badge>}
        </div>
      </div>
    </div>
  );
}

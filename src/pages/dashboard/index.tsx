import React from 'react';
import { useCounts } from '@/lib/useApi';

function Stat({label, value}:{label:string; value:React.ReactNode}){
  return (
    <div className="panel stat">
      <h4>{label.toUpperCase()}</h4>
      <div className="number">{value}</div>
    </div>
  );
}

export default function Dashboard(){
  const { data, loading, error } = useCounts();
  const c = data || {};
  return (
    <div>
      <div className="h1">Dashboard</div>
      {error ? <div className="panel">API error: {String(error.message||error)}</div> : null}
      <div className="grid-cards">
        <Stat label="Properties" value={loading?'…':(c.properties ?? '…')}/>
        <Stat label="Units"      value={loading?'…':(c.units ?? '…')}/>
        <Stat label="Leases"     value={loading?'…':(c.leases ?? '…')}/>
        <Stat label="Tenants"    value={loading?'…':(c.tenants ?? '…')}/>
        <Stat label="Owners"     value={loading?'…':(c.owners ?? '…')}/>
      </div>

      <div className="panel" style={{marginTop:16}}>
        <span className="badge">Next Best Action</span>
        <span style={{marginLeft:8}} className="badge">Powered by RPC</span>
      </div>
    </div>
  );
}
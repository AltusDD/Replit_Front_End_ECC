import { useCounts } from "@lib/useApi";

function Stat({label, value}:{label:string, value:any}){
  return (
    <div className="card">
      <h6>{label}</h6>
      <div className="n">{value ?? "…"}</div>
    </div>
  );
}

export default function Dashboard(){
  const {data, error} = useCounts();
  return (
    <>
      <h1 className="pageTitle">Dashboard</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      <div className="cards">
        <Stat label="Properties" value={data?.properties}/>
        <Stat label="Units" value={data?.units}/>
        <Stat label="Leases" value={data?.leases}/>
        <Stat label="Tenants" value={data?.tenants}/>
        <Stat label="Owners" value={data?.owners}/>
      </div>
      <div style={{marginTop:16}}><span className="badge">Powered by RPC</span></div>
    </>
  );
}

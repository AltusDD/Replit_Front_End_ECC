import { useCounts } from "@lib/useApi";
import StatCard from "@/components/ui/StatCard";

export default function Dashboard(){
  const {data, error} = useCounts();
  return (
    <>
      <h1 className="pageTitle">Dashboard</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      <div className="cards">
        <StatCard title="Properties" value={data?.properties} />
        <StatCard title="Units" value={data?.units} />
        <StatCard title="Leases" value={data?.leases} />
        <StatCard title="Tenants" value={data?.tenants} />
        <StatCard title="Owners" value={data?.owners} />
      </div>
      <div style={{marginTop:16}}><span className="kvp">Counts from V3; RPC optional</span></div>
    </>
  );
}

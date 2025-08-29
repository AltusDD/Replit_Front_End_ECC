import StatCard from "@/components/ui/StatCard";
import { useCounts } from "@/lib/useApi";

export default function Dashboard(){
  const { data } = useCounts();
  const c = data || {};
  const items = [
    { label:"Properties", value: c.properties ?? "…" },
    { label:"Units",      value: c.units ?? "…" },
    { label:"Leases",     value: c.leases ?? "…" },
    { label:"Tenants",    value: c.tenants ?? "…" },
    { label:"Owners",     value: c.owners ?? "…" },
  ];
  return (
    <div className="stack">
      <h1 className="page-title">Dashboard</h1>
      <div className="cards">
        {items.map(i => <StatCard key={i.label} label={i.label} value={i.value} />)}
      </div>
      <div className="panel"><span className="badge primary">Powered by RPC</span></div>
    </div>
  );
}
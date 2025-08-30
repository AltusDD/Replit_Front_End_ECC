import StatCard from '@/components/ui/StatCard';
import { useCounts } from '@lib/useApi';

export default function Dashboard() {
  const { data, loading, error } = useCounts();
  const v = (k: string) => data?.[k];

  return (
    <div className="page">
      <h1 className="ec-title">Dashboard</h1>
      {error && <div className="panel">API error: {String((error as any)?.message || error)}</div>}
      <div className="grid-kpis">
        <StatCard title="Properties" value={v('properties')} loading={loading} />
        <StatCard title="Units" value={v('units')} loading={loading} />
        <StatCard title="Leases" value={v('leases')} loading={loading} />
        <StatCard title="Tenants" value={v('tenants')} loading={loading} />
        <StatCard title="Owners" value={v('owners')} loading={loading} />
      </div>
      <span className="badge">Powered by RPC</span>
    </div>
  );
}

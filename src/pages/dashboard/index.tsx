import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { useCounts } from '@/lib/useApi';

export default function Dashboard() {
  const { data, loading, error } = useCounts();

  const counts = {
    properties: data?.properties ?? '…',
    units: data?.units ?? '…',
    leases: data?.leases ?? '…',
    tenants: data?.tenants ?? '…',
    owners: data?.owners ?? '…',
  };

  return (
    <>
      <div className="header"><h1>Dashboard</h1></div>

      {error && <div className="panel">API error: {String((error as any)?.message || error)}</div>}

      <div className="stat-grid" style={{ marginBottom: 18 }}>
        <StatCard label="Properties" value={counts.properties} />
        <StatCard label="Units" value={counts.units} />
        <StatCard label="Leases" value={counts.leases} />
        <StatCard label="Tenants" value={counts.tenants} />
        <StatCard label="Owners" value={counts.owners} />
      </div>

      <div className="panel">
        <strong>Next Best Action</strong> <span className="badge">Powered by RPC</span>
      </div>
    </>
  );
}
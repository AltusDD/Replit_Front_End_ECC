import React from 'react';
import SmartTable from '@/components/ui/SmartTable';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function LeasesPage() {
  const { data = [], loading, error } = useCollection('leases');
  const [, setLocation] = useLocation();

  // Calculate KPIs
  const totalLeases = data.length;
  const activeLeases = data.filter((l: any) => l.status === 'active').length;
  const totalBalanceDue = data.reduce((sum: number, l: any) => sum + (l.total_balance_due || 0), 0);

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Leases</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Leases: {totalLeases}</div>
        <div className="card">Active Leases: {activeLeases}</div>
        <div className="card">Total Balance Due: ${totalBalanceDue.toFixed(2)}</div>
      </div>

      <SmartTable 
        rows={data} 
        loading={loading}
        error={error}
        onRowDoubleClick={(id) => setLocation(`/card/lease/${id}`)} 
      />
    </div>
  );
}
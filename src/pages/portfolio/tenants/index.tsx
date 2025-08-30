import React from 'react';
import SmartTable from '@/components/ui/SmartTable';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function TenantsPage() {
  const { data = [], loading, error } = useCollection('tenants');
  const [, setLocation] = useLocation();

  // Calculate KPIs
  const totalTenants = data.length;
  const delinquentTenants = data.filter((t: any) => (t.total_balance_due || 0) > 0).length;
  const avgCreditScore = data.length > 0 ? Math.round(data.reduce((sum: number, t: any) => sum + (t.credit_score || 0), 0) / data.length) : 0;

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Tenants</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Tenants: {totalTenants}</div>
        <div className="card">Delinquent: {delinquentTenants}</div>
        <div className="card">Avg Credit Score: {avgCreditScore}</div>
      </div>

      <SmartTable 
        rows={data} 
        loading={loading}
        error={error}
        onRowDoubleClick={(id) => setLocation(`/card/tenant/${id}`)} 
      />
    </div>
  );
}
import React from 'react';
import SmartTable from '@/components/ui/SmartTable';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function UnitsPage() {
  const { data = [], loading, error } = useCollection('units');
  const [, setLocation] = useLocation();

  // Calculate KPIs
  const totalUnits = data.length;
  const vacantUnits = data.filter((u: any) => !u.tenant_name || u.status === 'vacant').length;
  const avgRent = data.length > 0 ? Math.round(data.reduce((sum: number, u: any) => sum + (u.rent_amount || 0), 0) / data.length) : 0;

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Units</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Units: {totalUnits}</div>
        <div className="card">Vacant Units: {vacantUnits}</div>
        <div className="card">Avg Rent: ${avgRent}</div>
      </div>

      <SmartTable 
        rows={data} 
        loading={loading}
        error={error}
        onRowDoubleClick={(id) => setLocation(`/card/unit/${id}`)} 
      />
    </div>
  );
}
import React from 'react';
import SmartTable from '@/components/ui/SmartTable';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function PropertiesPage() {
  const { data = [], loading, error } = useCollection('properties');
  const [, setLocation] = useLocation();

  // Calculate KPIs
  const totalProperties = data.length;
  const avgOccupancy = data.length > 0 ? Math.round(data.reduce((sum: number, p: any) => sum + (p.occupancy_rate || 0), 0) / data.length) : 0;
  const openUnits = data.reduce((sum: number, p: any) => sum + (p.open_units || 0), 0);

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Properties</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Properties: {totalProperties}</div>
        <div className="card">Occupancy Avg: {avgOccupancy}%</div>
        <div className="card">Open Units: {openUnits}</div>
      </div>

      <SmartTable 
        rows={data} 
        loading={loading}
        error={error}
        onRowDoubleClick={(id) => setLocation(`/card/property/${id}`)} 
      />
    </div>
  );
}
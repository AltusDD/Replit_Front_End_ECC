import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function PropertiesPage() {
  const { data = [], loading } = useCollection('properties');
  const [, setLocation] = useLocation();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'address_city', label: 'City' },
    { key: 'address_state', label: 'State' },
    { key: 'type', label: 'Type' },
    {
      key: 'unit_count',
      label: 'Units',
      render: (row: any) => row.unit_count ?? 'N/A',
    },
    {
      key: 'occupancy_rate',
      label: 'Occupancy',
      render: (row: any) => (
        <span style={{ color: row.occupancy_rate > 90 ? 'var(--color-status-good)' : 'var(--color-status-warning)' }}>
          {row.occupancy_rate ? `${row.occupancy_rate}%` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'open_units',
      label: 'Open Units',
      render: (row: any) =>
        row.open_units > 0 ? (
          <span style={{ color: 'var(--color-status-warning)' }}>{row.open_units}</span>
        ) : (
          <span>{row.open_units || '0'}</span>
        ),
    },
    {
      key: 'health_score',
      label: 'Health',
      render: (row: any) =>
        row.health_score >= 80 ? (
          <span style={{ color: 'var(--color-status-good)' }}>{row.health_score}</span>
        ) : row.health_score >= 50 ? (
          <span style={{ color: 'var(--color-status-warning)' }}>{row.health_score}</span>
        ) : (
          <span style={{ color: 'var(--color-status-critical)' }}>{row.health_score || 'N/A'}</span>
        ),
    },
    { 
      key: 'updated_at',
      label: 'Updated', 
      render: (row: any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''
    },
  ];


  // Calculate KPIs
  const totalProperties = data.length;
  const avgOccupancy = data.length > 0 ? Math.round(data.reduce((sum: number, p: any) => sum + (p.occupancy_rate || 0), 0) / data.length) : 0;
  const openUnits = data.reduce((sum: number, p: any) => sum + (p.open_units || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Properties</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Properties</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Properties: {totalProperties}</div>
        <div className="card">Occupancy Avg: {avgOccupancy}%</div>
        <div className="card">Open Units: {openUnits}</div>
      </div>

      <Table rows={data} cols={columns} entityType="property" onRowClick={(row) => setLocation(`/card/property/${row.id}`)} />
    </div>
  );
}
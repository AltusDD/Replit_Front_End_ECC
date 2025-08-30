import React from 'react';
import Table from '@/components/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function PropertiesPage() {
  const { data = [], loading } = useCollection('properties');
  const [, setLocation] = useLocation();

  const columns = [
    { label: 'Name', accessor: 'name' },
    { label: 'City', accessor: 'address_city' },
    { label: 'State', accessor: 'address_state' },
    { label: 'Type', accessor: 'type' },
    {
      label: 'Units',
      accessor: 'unit_count',
      render: (value: any) => value ?? 'N/A',
    },
    {
      label: 'Occupancy',
      accessor: 'occupancy_rate',
      render: (value: any) => (
        <span style={{ color: value > 90 ? 'var(--color-status-good)' : 'var(--color-status-warning)' }}>
          {value ? `${value}%` : 'N/A'}
        </span>
      ),
    },
    {
      label: 'Open Units',
      accessor: 'open_units',
      render: (value: any) =>
        value > 0 ? (
          <span style={{ color: 'var(--color-status-warning)' }}>{value}</span>
        ) : (
          <span>{value || '0'}</span>
        ),
    },
    {
      label: 'Health',
      accessor: 'health_score',
      render: (value: any) =>
        value >= 80 ? (
          <span style={{ color: 'var(--color-status-good)' }}>{value}</span>
        ) : value >= 50 ? (
          <span style={{ color: 'var(--color-status-warning)' }}>{value}</span>
        ) : (
          <span style={{ color: 'var(--color-status-critical)' }}>{value || 'N/A'}</span>
        ),
    },
    { 
      label: 'Updated', 
      accessor: 'updated_at',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : ''
    },
  ];

  const handleRowDoubleClick = (row: any) => {
    setLocation(`/card/property/${row.id}`);
  };

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

      <Table columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
    </div>
  );
}
import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function UnitsPage() {
  const { data = [], loading } = useCollection('units');
  const [, setLocation] = useLocation();

  const columns = [
    { key: 'unit_number', label: 'Unit' },
    { key: 'beds', label: 'Beds' },
    { key: 'baths', label: 'Baths' },
    { key: 'sq_ft', label: 'Sq Ft', render: (row: any) => row.sq_ft || 'N/A' },
    {
      key: 'rent_amount',
      label: 'Rent',
      render: (row: any) => row.rent_amount ? `$${row.rent_amount}` : 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span style={{ 
          color: row.status === 'occupied' ? 'var(--color-status-good)' : 
                 row.status === 'vacant' ? 'var(--color-status-warning)' : 
                 'var(--color-text-primary)'
        }}>
          {row.status || 'N/A'}
        </span>
      ),
    },
    {
      key: 'lease_end_date',
      label: 'Lease Ends',
      render: (row: any) => row.lease_end_date ? new Date(row.lease_end_date).toLocaleDateString() : 'N/A',
    },
    {
      key: 'tenant_name',
      label: 'Tenant',
      render: (row: any) => row.tenant_name || <span style={{ color: 'var(--color-status-warning)' }}>Vacant</span>,
    },
    { 
      key: 'updated_at',
      label: 'Updated', 
      render: (row: any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''
    },
  ];


  // Calculate KPIs
  const totalUnits = data.length;
  const vacantUnits = data.filter((u: any) => !u.tenant_name || u.status === 'vacant').length;
  const avgRent = data.length > 0 ? Math.round(data.reduce((sum: number, u: any) => sum + (u.rent_amount || 0), 0) / data.length) : 0;

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Units</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Units</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Units: {totalUnits}</div>
        <div className="card">Vacant Units: {vacantUnits}</div>
        <div className="card">Avg Rent: ${avgRent}</div>
      </div>

      <Table rows={data} cols={columns} entityType="unit" onRowClick={(row) => setLocation(`/card/unit/${row.id}`)} />
    </div>
  );
}
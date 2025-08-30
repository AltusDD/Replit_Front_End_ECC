import React from 'react';
import Table from '@/components/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function UnitsPage() {
  const { data = [], loading } = useCollection('units');
  const [, setLocation] = useLocation();

  const columns = [
    { label: 'Unit', accessor: 'unit_number' },
    { label: 'Beds', accessor: 'beds' },
    { label: 'Baths', accessor: 'baths' },
    { label: 'Sq Ft', accessor: 'sq_ft', render: (value: any) => value || 'N/A' },
    {
      label: 'Rent',
      accessor: 'rent_amount',
      render: (value: any) => value ? `$${value}` : 'N/A',
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (value: any) => (
        <span style={{ 
          color: value === 'occupied' ? 'var(--color-status-good)' : 
                 value === 'vacant' ? 'var(--color-status-warning)' : 
                 'var(--color-text-primary)'
        }}>
          {value || 'N/A'}
        </span>
      ),
    },
    {
      label: 'Lease Ends',
      accessor: 'lease_end_date',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      label: 'Tenant',
      accessor: 'tenant_name',
      render: (value: any) => value || <span style={{ color: 'var(--color-status-warning)' }}>Vacant</span>,
    },
    { 
      label: 'Updated', 
      accessor: 'updated_at',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : ''
    },
  ];

  const handleRowDoubleClick = (row: any) => {
    setLocation(`/card/unit/${row.id}`);
  };

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

      <Table columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
    </div>
  );
}
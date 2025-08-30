import React from 'react';
import Table from '@/components/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function LeasesPage() {
  const { data = [], loading } = useCollection('leases');
  const [, setLocation] = useLocation();

  const columns = [
    { label: 'Lease ID', accessor: 'id' },
    { label: 'Property ID', accessor: 'property_id' },
    { label: 'Unit ID', accessor: 'unit_id' },
    { label: 'Tenant', accessor: 'tenant_name', render: (value: any, row: any) => value || row.primary_tenant_id || 'N/A' },
    {
      label: 'Start Date',
      accessor: 'start_date',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      label: 'End Date',
      accessor: 'end_date',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      label: 'Rent',
      accessor: 'rent_cents',
      render: (value: any) => value ? `$${(value/100).toFixed(2)}` : 'N/A',
    },
    {
      label: 'Balance Due',
      accessor: 'total_balance_due',
      render: (value: any) => {
        const amount = value || 0;
        const color = amount > 0 ? 'var(--color-status-critical)' : 'var(--color-status-good)';
        return <span style={{color}}>${amount.toFixed(2)}</span>;
      },
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (value: any) => (
        <span style={{ 
          color: value === 'active' ? 'var(--color-status-good)' : 
                 value === 'expired' ? 'var(--color-status-critical)' : 
                 'var(--color-text-primary)'
        }}>
          {value || 'N/A'}
        </span>
      ),
    },
    { 
      label: 'Updated', 
      accessor: 'updated_at',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : ''
    },
  ];

  const handleRowDoubleClick = (row: any) => {
    setLocation(`/card/lease/${row.id}`);
  };

  // Calculate KPIs
  const totalLeases = data.length;
  const activeLeases = data.filter((l: any) => l.status === 'active').length;
  const totalBalanceDue = data.reduce((sum: number, l: any) => sum + (l.total_balance_due || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Leases</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Leases</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Leases: {totalLeases}</div>
        <div className="card">Active Leases: {activeLeases}</div>
        <div className="card">Total Balance Due: ${totalBalanceDue.toFixed(2)}</div>
      </div>

      <Table columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
    </div>
  );
}
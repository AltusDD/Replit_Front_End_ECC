import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function LeasesPage() {
  const { data = [], loading } = useCollection('leases');
  const [, setLocation] = useLocation();

  const columns = [
    { key: 'id', label: 'Lease ID' },
    { key: 'property_id', label: 'Property ID' },
    { key: 'unit_id', label: 'Unit ID' },
    { key: 'tenant_name', label: 'Tenant', render: (row: any) => row.tenant_name || row.primary_tenant_id || 'N/A' },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (row: any) => row.start_date ? new Date(row.start_date).toLocaleDateString() : 'N/A',
    },
    {
      key: 'end_date',
      label: 'End Date',
      render: (row: any) => row.end_date ? new Date(row.end_date).toLocaleDateString() : 'N/A',
    },
    {
      key: 'rent_cents',
      label: 'Rent',
      render: (row: any) => row.rent_cents ? `$${(row.rent_cents/100).toFixed(2)}` : 'N/A',
    },
    {
      key: 'total_balance_due',
      label: 'Balance Due',
      render: (row: any) => {
        const amount = row.total_balance_due || 0;
        const color = amount > 0 ? 'var(--color-status-critical)' : 'var(--color-status-good)';
        return <span style={{color}}>${amount.toFixed(2)}</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span style={{ 
          color: row.status === 'active' ? 'var(--color-status-good)' : 
                 row.status === 'expired' ? 'var(--color-status-critical)' : 
                 'var(--color-text-primary)'
        }}>
          {row.status || 'N/A'}
        </span>
      ),
    },
    { 
      key: 'updated_at',
      label: 'Updated', 
      render: (row: any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''
    },
  ];


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

      <Table rows={data} cols={columns} entityType="lease" onRowClick={(row) => setLocation(`/card/lease/${row.id}`)} />
    </div>
  );
}
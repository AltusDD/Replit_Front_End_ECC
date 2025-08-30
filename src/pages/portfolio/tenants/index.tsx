import React from 'react';
import Table from '@/components/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function TenantsPage() {
  const { data = [], loading } = useCollection('tenants');
  const [, setLocation] = useLocation();

  const columns = [
    { label: 'Name', accessor: 'display_name' },
    { label: 'First Name', accessor: 'first_name' },
    { label: 'Last Name', accessor: 'last_name' },
    { label: 'Type', accessor: 'type' },
    { label: 'Email', accessor: 'email' },
    { label: 'Company', accessor: 'company_name' },
    {
      label: 'Credit Score',
      accessor: 'credit_score',
      render: (value: any) => {
        if (!value) return 'N/A';
        const color = value >= 700 ? 'var(--color-status-good)' : 
                     value >= 600 ? 'var(--color-status-warning)' : 
                     'var(--color-status-critical)';
        return <span style={{color}}>{value}</span>;
      },
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
      label: 'Updated', 
      accessor: 'updated_at',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : ''
    },
  ];

  const handleRowDoubleClick = (row: any) => {
    setLocation(`/card/tenant/${row.id}`);
  };

  // Calculate KPIs
  const totalTenants = data.length;
  const delinquentTenants = data.filter((t: any) => (t.total_balance_due || 0) > 0).length;
  const avgCreditScore = data.length > 0 ? Math.round(data.reduce((sum: number, t: any) => sum + (t.credit_score || 0), 0) / data.length) : 0;

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Tenants</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Tenants</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Tenants: {totalTenants}</div>
        <div className="card">Delinquent: {delinquentTenants}</div>
        <div className="card">Avg Credit Score: {avgCreditScore}</div>
      </div>

      <Table columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
    </div>
  );
}
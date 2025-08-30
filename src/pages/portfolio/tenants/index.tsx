import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function TenantsPage() {
  const { data = [], loading } = useCollection('tenants');
  const [, setLocation] = useLocation();

  const columns = [
    { key: 'display_name', label: 'Name' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'type', label: 'Type' },
    { key: 'email', label: 'Email' },
    { key: 'company_name', label: 'Company' },
    {
      key: 'credit_score',
      label: 'Credit Score',
      render: (row: any) => {
        if (!row.credit_score) return 'N/A';
        const color = row.credit_score >= 700 ? 'var(--color-status-good)' : 
                     row.credit_score >= 600 ? 'var(--color-status-warning)' : 
                     'var(--color-status-critical)';
        return <span style={{color}}>{row.credit_score}</span>;
      },
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
      key: 'updated_at',
      label: 'Updated', 
      render: (row: any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''
    },
  ];


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

      <Table rows={data} cols={columns} entityType="tenant" onRowClick={(row) => setLocation(`/card/tenant/${row.id}`)} />
    </div>
  );
}
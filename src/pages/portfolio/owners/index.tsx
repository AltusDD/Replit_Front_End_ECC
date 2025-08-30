import React from 'react';
import Table from '@/components/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function OwnersPage() {
  const { data = [], loading } = useCollection('owners');
  const [, setLocation] = useLocation();

  const columns = [
    { label: 'Name', accessor: 'display_name' },
    { label: 'Company', accessor: 'company_name' },
    { label: 'First Name', accessor: 'first_name' },
    { label: 'Last Name', accessor: 'last_name' },
    { label: 'Contact Info', accessor: 'notes' },
    {
      label: 'Active',
      accessor: 'active',
      render: (value: any) => (
        <span style={{ 
          color: value ? 'var(--color-status-good)' : 'var(--color-status-critical)'
        }}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      label: 'Management Start',
      accessor: 'management_start_date',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    { 
      label: 'Updated', 
      accessor: 'updated_at',
      render: (value: any) => value ? new Date(value).toLocaleDateString() : ''
    },
  ];

  const handleRowDoubleClick = (row: any) => {
    setLocation(`/card/owner/${row.id}`);
  };

  // Calculate KPIs
  const totalOwners = data.length;
  const activeOwners = data.filter((o: any) => o.active).length;
  const companyOwners = data.filter((o: any) => o.company_name).length;

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Owners</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Owners</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Owners: {totalOwners}</div>
        <div className="card">Active: {activeOwners}</div>
        <div className="card">Companies: {companyOwners}</div>
      </div>

      <Table columns={columns} data={data} onRowDoubleClick={handleRowDoubleClick} />
    </div>
  );
}
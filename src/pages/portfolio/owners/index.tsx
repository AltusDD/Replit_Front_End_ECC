import React from 'react';
import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function OwnersPage() {
  const { data = [], loading } = useCollection('owners');
  const [, setLocation] = useLocation();

  const columns = [
    { key: 'display_name', label: 'Name' },
    { key: 'company_name', label: 'Company' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'notes', label: 'Contact Info' },
    {
      key: 'active',
      label: 'Active',
      render: (row: any) => (
        <span style={{ 
          color: row.active ? 'var(--color-status-good)' : 'var(--color-status-critical)'
        }}>
          {row.active ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'management_start_date',
      label: 'Management Start',
      render: (row: any) => row.management_start_date ? new Date(row.management_start_date).toLocaleDateString() : 'N/A',
    },
    { 
      key: 'updated_at',
      label: 'Updated', 
      render: (row: any) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''
    },
  ];


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

      <Table rows={data} cols={columns} entityType="owner" onRowClick={(row) => setLocation(`/card/owner/${row.id}`)} />
    </div>
  );
}
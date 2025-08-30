import React from 'react';
import SmartTable from '@/components/ui/SmartTable';
import { useCollection } from '@lib/useApi';
import { useLocation } from 'wouter';

export default function OwnersPage() {
  const { data = [], loading, error } = useCollection('owners');
  const [, setLocation] = useLocation();

  // Calculate KPIs
  const totalOwners = data.length;
  const activeOwners = data.filter((o: any) => o.active).length;
  const companyOwners = data.filter((o: any) => o.company_name).length;

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ color: 'var(--color-accent-primary)' }}>Portfolio: Owners</h1>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
        <div className="card">Total Owners: {totalOwners}</div>
        <div className="card">Active: {activeOwners}</div>
        <div className="card">Companies: {companyOwners}</div>
      </div>

      <SmartTable 
        rows={data} 
        loading={loading}
        error={error}
        onRowDoubleClick={(id) => setLocation(`/card/owner/${id}`)} 
      />
    </div>
  );
}
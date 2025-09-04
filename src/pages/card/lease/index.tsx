import React from 'react';
import { useParams } from 'wouter';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';

export default function LeaseCardPage() {
  const { id = '' } = useParams();

  const breadcrumbs = [
    { label: 'Portfolio', href: '/portfolio/leases' },
    { label: 'Leases', href: '/portfolio/leases' },
    { label: `Lease ${id}` }
  ];

  return (
    <div className="ecc-page">
      <Breadcrumbs items={breadcrumbs} />
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-4)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>📋</div>
        <h1 style={{ color: 'var(--text)', marginBottom: '8px' }}>Lease Card</h1>
        <p style={{ color: 'var(--text-subtle)' }}>Lease ID: {id}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-14)' }}>Implementation in progress...</p>
      </div>
    </div>
  );
}
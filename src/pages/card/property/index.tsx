import React from 'react';
import { useParams } from 'wouter';
import { usePropertyCard } from './api';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import Hero from './Hero';
import Tabs from './Tabs';
import RightRail from './RightRail';

export default function PropertyCardPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = usePropertyCard(id);

  const breadcrumbs = [
    { label: 'Portfolio', href: '/portfolio/properties' },
    { label: 'Properties', href: '/portfolio/properties' },
    { label: data?.title || 'Property' }
  ];

  if (isLoading) {
    return (
      <div className="ecc-page">
        <Breadcrumbs items={breadcrumbs} />
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--gap-4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>⏳</div>
          <div style={{ color: 'var(--text)', fontSize: 'var(--fs-16)' }}>Loading property...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="ecc-page">
        <Breadcrumbs items={breadcrumbs} />
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--gap-4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>❌</div>
          <h1 style={{ color: 'var(--text)', marginBottom: '8px' }}>Property Not Found</h1>
          <p style={{ color: 'var(--text-subtle)' }}>We couldn't find that property.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ecc-page">
      <Breadcrumbs items={breadcrumbs} />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 320px', 
        gap: 'var(--gap-3)',
        maxWidth: '1400px'
      }}>
        <div>
          <Hero data={data} />
          <Tabs data={data} />
        </div>
        <RightRail data={data} />
      </div>
    </div>
  );
}
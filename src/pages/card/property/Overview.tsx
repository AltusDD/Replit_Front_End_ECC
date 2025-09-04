import React from 'react';
import { PropertyCardDTO } from '../types';

interface OverviewProps {
  data: PropertyCardDTO;
}

export default function Overview({ data }: OverviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Identity Block */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          Property Information
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--gap-3)',
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-muted)', marginBottom: '4px' }}>Address</div>
            <div style={{ color: 'var(--text)' }}>{data.address.line1}</div>
            <div style={{ color: 'var(--text-subtle)' }}>
              {data.address.city}, {data.address.state} {data.address.zip}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-muted)', marginBottom: '4px' }}>Type</div>
            <div style={{ color: 'var(--text)' }}>{data.badges[0] || 'Property'}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-muted)', marginBottom: '4px' }}>Class</div>
            <div style={{ color: 'var(--text)' }}>{data.badges[1] || 'Residential'}</div>
          </div>
        </div>
      </div>

      {/* Linked Entities */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          Connected Assets
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--gap-2)' }}>
          <div style={{ 
            padding: 'var(--gap-3)', 
            background: 'var(--surface-2)', 
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏠</div>
            <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--gold)' }}>
              {data.linked?.units || 0}
            </div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Units</div>
          </div>
          <div style={{ 
            padding: 'var(--gap-3)', 
            background: 'var(--surface-2)', 
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--gold)' }}>
              {data.linked?.leases || 0}
            </div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Active Leases</div>
          </div>
          <div style={{ 
            padding: 'var(--gap-3)', 
            background: 'var(--surface-2)', 
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--gold)' }}>
              {data.linked?.tenants || 0}
            </div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Tenants</div>
          </div>
          {data.linked?.owner && (
            <div style={{ 
              padding: 'var(--gap-3)', 
              background: 'var(--surface-2)', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👑</div>
              <div style={{ fontSize: 'var(--fs-14)', fontWeight: 600, color: 'var(--text)' }}>
                {data.linked.owner.name}
              </div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Owner</div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          AI Insights
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-2)' }}>
          {data.insights?.map((insight, index) => (
            <div key={index} style={{
              padding: 'var(--gap-3)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--gold)'
            }}>
              <div style={{ color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                {insight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-1)' }}>
          <div style={{
            padding: 'var(--gap-2)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-14)'
          }}>
            <div style={{ color: 'var(--text)' }}>Payment received from Unit 101</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-12)' }}>2 hours ago</div>
          </div>
          <div style={{
            padding: 'var(--gap-2)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-14)'
          }}>
            <div style={{ color: 'var(--text)' }}>Maintenance request submitted for Unit 102</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-12)' }}>1 day ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
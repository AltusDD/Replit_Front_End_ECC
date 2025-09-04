import React from 'react';
import { PropertyCardDTO } from '../types';

interface HeroProps {
  data: PropertyCardDTO;
}

export default function Hero({ data }: HeroProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  return (
    <div style={{
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--gap-4)',
      marginBottom: 'var(--gap-3)',
      boxShadow: 'var(--shadow-1)'
    }}>
      {/* Top Row: Avatar + Title + Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--gap-3)',
        marginBottom: 'var(--gap-3)'
      }}>
        {/* Property Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--gold)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'var(--bg)'
        }}>
          🏢
        </div>

        {/* Title + Address */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: 'var(--fs-28)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            marginBottom: '4px'
          }}>
            {data.title}
          </h1>
          <div style={{
            fontSize: 'var(--fs-16)',
            color: 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{data.address.city}</span>
            <span>•</span>
            <span>{data.address.state}</span>
            <span>•</span>
            <button 
              onClick={() => copyToClipboard(data.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
              title="Copy ID to clipboard"
            >
              ID: {data.id.slice(-8)}
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div style={{
          display: 'flex',
          gap: 'var(--gap-1)',
          flexWrap: 'wrap'
        }}>
          {data.status.map(status => (
            <span key={status} style={{
              background: status === 'Active' ? 'var(--success)' : 'var(--warning)',
              color: 'var(--bg)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--fs-12)',
              fontWeight: 600
            }}>
              {status}
            </span>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 'var(--gap-3)',
        marginBottom: 'var(--gap-3)'
      }}>
        {data.kpis.map(kpi => (
          <div key={kpi.label} style={{
            background: 'var(--surface)',
            padding: 'var(--gap-2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--fs-22)',
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: '4px'
            }}>
              {kpi.value}
            </div>
            <div style={{
              fontSize: 'var(--fs-12)',
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: 'var(--gap-2)',
        flexWrap: 'wrap'
      }}>
        <button style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Edit Property
        </button>
        <button style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Record Payment
        </button>
        <button style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          New Work Order
        </button>
      </div>
    </div>
  );
}
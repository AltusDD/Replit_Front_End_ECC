import React from 'react';
import { PropertyCardDTO } from '../types';

interface LegalProps {
  data: PropertyCardDTO;
}

export default function Legal({ data }: LegalProps) {
  // Sample legal cases data
  const legalCases = [
    {
      id: 'CASE-001',
      type: 'Eviction',
      status: 'Active',
      nextDate: '2024-02-15',
      attorney: 'Smith & Associates',
      tenant: 'John Doe - Unit 103',
      description: 'Non-payment of rent for November and December 2023'
    }
  ];

  const complianceItems = [
    { item: 'Fire Safety Inspection', status: 'Current', expiry: '2024-12-01', priority: 'low' },
    { item: 'Elevator Certificate', status: 'Expiring Soon', expiry: '2024-02-28', priority: 'high' },
    { item: 'Property Insurance', status: 'Current', expiry: '2024-12-31', priority: 'low' },
    { item: 'Business License', status: 'Current', expiry: '2025-03-15', priority: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'var(--warning)';
      case 'closed': return 'var(--success)';
      case 'current': return 'var(--success)';
      case 'expiring soon': return 'var(--warning)';
      case 'expired': return 'var(--danger)';
      default: return 'var(--text-subtle)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-subtle)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--gap-2)', flexWrap: 'wrap' }}>
        <button style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Send to Legal
        </button>
        <button style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Generate Packet
        </button>
        <button style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Add Filing
        </button>
      </div>

      {/* Active Cases */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          Active Legal Cases
        </h2>
        {legalCases.length > 0 ? (
          <div style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    CASE ID
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    TYPE
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    STATUS
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    NEXT DATE
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                    ATTORNEY
                  </th>
                </tr>
              </thead>
              <tbody>
                {legalCases.map((case_, index) => (
                  <tr key={case_.id} style={{ 
                    borderBottom: index < legalCases.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer'
                  }}>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 600 }}>
                      {case_.id}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                      {case_.type}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: getStatusColor(case_.status),
                        color: 'var(--bg)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 'var(--fs-12)',
                        fontWeight: 600
                      }}>
                        {case_.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                      {new Date(case_.nextDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                      {case_.attorney}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: 'var(--gap-4)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>⚖️</div>
            <div style={{ color: 'var(--text)', fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: '8px' }}>
              No Active Legal Cases
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-14)' }}>
              This property currently has no active legal proceedings.
            </div>
          </div>
        )}
      </div>

      {/* Compliance Status */}
      <div>
        <h2 style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--gap-2)' }}>
          Compliance & Certifications
        </h2>
        <div style={{
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                  REQUIREMENT
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                  STATUS
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                  EXPIRY DATE
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                  PRIORITY
                </th>
              </tr>
            </thead>
            <tbody>
              {complianceItems.map((item, index) => (
                <tr key={item.item} style={{ 
                  borderBottom: index < complianceItems.length - 1 ? '1px solid var(--border)' : 'none' 
                }}>
                  <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 500 }}>
                    {item.item}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: getStatusColor(item.status),
                      color: 'var(--bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: 'var(--fs-12)',
                      fontWeight: 600
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                    {new Date(item.expiry).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      color: getPriorityColor(item.priority),
                      fontSize: 'var(--fs-12)',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
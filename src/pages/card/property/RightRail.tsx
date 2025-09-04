import React from 'react';
import { PropertyCardDTO } from '../types';

interface RightRailProps {
  data: PropertyCardDTO;
}

export default function RightRail({ data }: RightRailProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-3)'
    }}>
      {/* Risk Score Widget */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-3)',
        boxShadow: 'var(--shadow-1)'
      }}>
        <h3 style={{
          fontSize: 'var(--fs-16)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 var(--gap-2) 0'
        }}>
          Risk Score
        </h3>
        <div style={{
          textAlign: 'center',
          padding: 'var(--gap-2)'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--success)',
            marginBottom: '4px'
          }}>
            85
          </div>
          <div style={{
            fontSize: 'var(--fs-12)',
            color: 'var(--text-subtle)'
          }}>
            Low Risk
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-3)',
        boxShadow: 'var(--shadow-1)'
      }}>
        <h3 style={{
          fontSize: 'var(--fs-16)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 var(--gap-2) 0'
        }}>
          Recent Payments
        </h3>
        <div style={{ fontSize: 'var(--fs-14)', color: 'var(--text-subtle)' }}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Unit 101</span>
              <span style={{ color: 'var(--success)' }}>$1,200</span>
            </div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-muted)' }}>
              Jan 1, 2024
            </div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Unit 102</span>
              <span style={{ color: 'var(--success)' }}>$1,350</span>
            </div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-muted)' }}>
              Dec 28, 2023
            </div>
          </div>
        </div>
      </div>

      {/* Legal Status */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-3)',
        boxShadow: 'var(--shadow-1)'
      }}>
        <h3 style={{
          fontSize: 'var(--fs-16)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 var(--gap-2) 0'
        }}>
          Legal Status
        </h3>
        <div style={{
          padding: '12px',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--fs-14)',
            color: 'var(--success)',
            fontWeight: 600
          }}>
            Clear
          </div>
          <div style={{
            fontSize: 'var(--fs-12)',
            color: 'var(--text-subtle)'
          }}>
            No active cases
          </div>
        </div>
      </div>

      {/* Quick Files */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-3)',
        boxShadow: 'var(--shadow-1)'
      }}>
        <h3 style={{
          fontSize: 'var(--fs-16)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 var(--gap-2) 0'
        }}>
          Quick Files
        </h3>
        <div style={{ fontSize: 'var(--fs-14)' }}>
          <div style={{ 
            padding: '8px 0', 
            color: 'var(--link)', 
            cursor: 'pointer' 
          }}>
            📄 Property Deed
          </div>
          <div style={{ 
            padding: '8px 0', 
            color: 'var(--link)', 
            cursor: 'pointer' 
          }}>
            📋 Insurance Policy
          </div>
          <div style={{ 
            padding: '8px 0', 
            color: 'var(--link)', 
            cursor: 'pointer' 
          }}>
            📊 Annual Report
          </div>
        </div>
      </div>
    </div>
  );
}
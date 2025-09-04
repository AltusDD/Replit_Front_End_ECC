import React from 'react';
import { PropertyCardDTO } from '../types';

interface LinkedProps {
  data: PropertyCardDTO;
}

export default function Linked({ data }: LinkedProps) {
  // Sample linked entities data
  const units = [
    { id: '1', number: '101', status: 'Occupied', rent: 1200, tenant: 'John Smith' },
    { id: '2', number: '102', status: 'Occupied', rent: 1350, tenant: 'Sarah Johnson' },
    { id: '3', number: '103', status: 'Vacant', rent: 1250, tenant: null },
    { id: '4', number: '201', status: 'Turn', rent: 1300, tenant: null }
  ];

  const leases = [
    { id: 'L001', unit: '101', tenant: 'John Smith', start: '2023-06-01', end: '2024-05-31', rent: 1200, status: 'Active' },
    { id: 'L002', unit: '102', tenant: 'Sarah Johnson', start: '2023-12-01', end: '2024-11-30', rent: 1350, status: 'Active' },
    { id: 'L003', unit: '103', tenant: 'Mike Wilson', start: '2023-01-01', end: '2023-12-31', rent: 1250, status: 'Expired' }
  ];

  const tenants = [
    { id: 'T001', name: 'John Smith', unit: '101', balance: 0, lastPayment: '2024-01-01', status: 'Current' },
    { id: 'T002', name: 'Sarah Johnson', unit: '102', balance: 0, lastPayment: '2024-01-01', status: 'Current' }
  ];

  const workOrders = [
    { id: 'WO001', unit: '101', description: 'Leaky faucet in bathroom', status: 'Open', priority: 'Medium', created: '2024-01-10' },
    { id: 'WO002', unit: '102', description: 'HVAC maintenance', status: 'Scheduled', priority: 'Low', created: '2024-01-08' },
    { id: 'WO003', unit: '103', description: 'Paint touch-up', status: 'Completed', priority: 'Low', created: '2024-01-05' }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'occupied':
      case 'active':
      case 'current':
      case 'completed': return 'var(--success)';
      case 'vacant':
      case 'expired':
      case 'open': return 'var(--warning)';
      case 'turn':
      case 'scheduled': return 'var(--info)';
      default: return 'var(--text-subtle)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-subtle)';
    }
  };

  const EntityTable = ({ title, data, headers, renderRow }: any) => (
    <div>
      <h3 style={{ 
        fontSize: 'var(--fs-16)', 
        fontWeight: 600, 
        color: 'var(--text)', 
        marginBottom: 'var(--gap-2)' 
      }}>
        {title} ({data.length})
      </h3>
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {headers.map((header: string) => (
                <th key={header} style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  color: 'var(--text-subtle)', 
                  fontSize: 'var(--fs-12)' 
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index: number) => (
              <tr key={item.id} style={{ 
                borderBottom: index < data.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer'
              }}>
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--gap-3)' }}>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏠</div>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--gold)' }}>
            {units.length}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Total Units</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--success)' }}>
            {leases.filter(l => l.status === 'Active').length}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Active Leases</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--info)' }}>
            {tenants.length}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Current Tenants</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔧</div>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--warning)' }}>
            {workOrders.filter(wo => wo.status !== 'Completed').length}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Open Work Orders</div>
        </div>
      </div>

      {/* Units Table */}
      <EntityTable
        title="Units"
        data={units}
        headers={['UNIT', 'STATUS', 'RENT', 'TENANT']}
        renderRow={(unit: any) => (
          <>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 600 }}>
              {unit.number}
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                background: getStatusColor(unit.status),
                color: 'var(--bg)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--fs-12)',
                fontWeight: 600
              }}>
                {unit.status}
              </span>
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              ${unit.rent.toLocaleString()}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {unit.tenant || '—'}
            </td>
          </>
        )}
      />

      {/* Active Leases Table */}
      <EntityTable
        title="Active Leases"
        data={leases.filter(l => l.status === 'Active')}
        headers={['LEASE ID', 'UNIT', 'TENANT', 'RENT', 'LEASE END']}
        renderRow={(lease: any) => (
          <>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 600 }}>
              {lease.id}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {lease.unit}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {lease.tenant}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              ${lease.rent.toLocaleString()}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {new Date(lease.end).toLocaleDateString()}
            </td>
          </>
        )}
      />

      {/* Current Tenants Table */}
      <EntityTable
        title="Current Tenants"
        data={tenants}
        headers={['TENANT', 'UNIT', 'BALANCE', 'LAST PAYMENT', 'STATUS']}
        renderRow={(tenant: any) => (
          <>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 600 }}>
              {tenant.name}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {tenant.unit}
            </td>
            <td style={{ 
              padding: '12px', 
              fontSize: 'var(--fs-14)',
              fontWeight: 600,
              color: tenant.balance > 0 ? 'var(--danger)' : 'var(--success)'
            }}>
              ${tenant.balance.toLocaleString()}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {new Date(tenant.lastPayment).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                background: getStatusColor(tenant.status),
                color: 'var(--bg)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--fs-12)',
                fontWeight: 600
              }}>
                {tenant.status}
              </span>
            </td>
          </>
        )}
      />

      {/* Recent Work Orders */}
      <EntityTable
        title="Recent Work Orders"
        data={workOrders.slice(0, 5)}
        headers={['WO ID', 'UNIT', 'DESCRIPTION', 'STATUS', 'PRIORITY']}
        renderRow={(wo: any) => (
          <>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)', fontWeight: 600 }}>
              {wo.id}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {wo.unit}
            </td>
            <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
              {wo.description}
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                background: getStatusColor(wo.status),
                color: 'var(--bg)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--fs-12)',
                fontWeight: 600
              }}>
                {wo.status}
              </span>
            </td>
            <td style={{ padding: '12px' }}>
              <span style={{
                color: getPriorityColor(wo.priority),
                fontSize: 'var(--fs-12)',
                fontWeight: 600
              }}>
                {wo.priority}
              </span>
            </td>
          </>
        )}
      />
    </div>
  );
}
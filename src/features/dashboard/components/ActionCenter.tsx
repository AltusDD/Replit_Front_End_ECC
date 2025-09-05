// src/features/dashboard/components/ActionCenter.tsx
import React from 'react';
import { format } from 'date-fns';
import { ActionButton } from './ActionButton';
import type { DashboardLease, DashboardTenant, DashboardProperty } from '../api/mock-data';

interface ActionCenterProps {
  leases: DashboardLease[];
  tenants: DashboardTenant[];
  properties: DashboardProperty[];
}

export function ActionCenter({ leases, tenants, properties }: ActionCenterProps) {
  // Get leases expiring in next 45 days
  const expiringLeases = React.useMemo(() => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 45);
    
    return leases
      .filter(lease => {
        const endDate = new Date(lease.endDate);
        return lease.status === 'active' && endDate >= now && endDate <= futureDate;
      })
      .slice(0, 3);
  }, [leases]);

  // Get top delinquent tenants
  const delinquentTenants = React.useMemo(() => {
    return tenants
      .filter(tenant => tenant.isDelinquent && tenant.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 3);
  }, [tenants]);

  // Get high priority work orders (placeholder - no work order API yet)
  const highPriorityWorkOrders = React.useMemo(() => {
    return []; // Empty until work orders API is available
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const shortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy');
  };

  const getPropertyName = (tenantPropertyName?: string) => {
    // Use propertyName from tenant data directly since real API provides it
    return tenantPropertyName || 'Unknown Property';
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  };

  return (
    <div className="space-y-6">
      {/* Leases Expiring */}
      <div className="action-section">
        <h4 className="text-sm font-semibold text-[var(--altus-text)] mb-3 uppercase tracking-wide">
          Leases Expiring (Next 45 Days)
        </h4>
        <div className="space-y-3">
          {expiringLeases.map((lease) => (
            <div key={lease.id} className="action-item">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--altus-text)]">
                  {getTenantName(lease.tenantId)}
                </div>
                <div className="text-xs text-[var(--altus-muted)]">
                  {lease.unitLabel || 'Unknown Unit'} • Ends {shortDate(lease.endDate || '')}
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton 
                  size="sm" 
                  onClick={() => console.info('Contact tenant', lease.tenantId)}
                  data-testid={`contact-tenant-${lease.id}`}
                >
                  Contact
                </ActionButton>
                <ActionButton 
                  size="sm" 
                  variant="primary"
                  onClick={() => console.info('Start renewal', lease.id)}
                  data-testid={`start-renewal-${lease.id}`}
                >
                  Renew
                </ActionButton>
              </div>
            </div>
          ))}
          {expiringLeases.length === 0 && (
            <div className="text-sm text-[var(--altus-muted)] text-center py-4">
              No leases expiring soon
            </div>
          )}
        </div>
      </div>

      {/* Top Delinquent Tenants */}
      <div className="action-section">
        <h4 className="text-sm font-semibold text-[var(--altus-text)] mb-3 uppercase tracking-wide">
          Top Delinquent Tenants
        </h4>
        <div className="space-y-3">
          {delinquentTenants.map((tenant) => (
            <div key={tenant.id} className="action-item">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--altus-text)]">
                  {tenant.name}
                </div>
                <div className="text-xs text-[var(--altus-muted)]">
                  {getPropertyName(tenant.propertyName)} • 
                  <span className="text-red-400 ml-1">
                    ${tenant.balance.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton 
                  size="sm"
                  to={`/card/tenant/${tenant.id}?tab=ledger`}
                  data-testid={`view-ledger-${tenant.id}`}
                >
                  Ledger
                </ActionButton>
                <ActionButton 
                  size="sm" 
                  variant="danger"
                  onClick={() => console.info('Send reminder', tenant.id)}
                  data-testid={`send-reminder-${tenant.id}`}
                >
                  Remind
                </ActionButton>
              </div>
            </div>
          ))}
          {delinquentTenants.length === 0 && (
            <div className="text-sm text-[var(--altus-muted)] text-center py-4">
              No delinquent tenants
            </div>
          )}
        </div>
      </div>

      {/* High Priority Work Orders */}
      <div className="action-section">
        <h4 className="text-sm font-semibold text-[var(--altus-text)] mb-3 uppercase tracking-wide">
          New High-Priority Work Orders
        </h4>
        <div className="space-y-3">
          <div className="text-sm text-[var(--altus-muted)] text-center py-4">
            Work orders API not yet available
          </div>
        </div>
      </div>
    </div>
  );
}
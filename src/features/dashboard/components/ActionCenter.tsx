// src/features/dashboard/components/ActionCenter.tsx
import React from 'react';
import { format } from 'date-fns';
import { ActionButton } from './ActionButton';
import type { Lease, TenantSummary, WorkOrder, Property } from '../api/mock-data';

interface ActionCenterProps {
  leases: Lease[];
  tenants: TenantSummary[];
  workOrders: WorkOrder[];
  properties: Property[];
}

export function ActionCenter({ leases, tenants, workOrders, properties }: ActionCenterProps) {
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
      .filter(tenant => tenant.isDelinquent && tenant.balanceDue > 0)
      .sort((a, b) => b.balanceDue - a.balanceDue)
      .slice(0, 3);
  }, [tenants]);

  // Get high priority work orders
  const highPriorityWorkOrders = React.useMemo(() => {
    return workOrders
      .filter(wo => wo.priority === 'high' && !wo.assignedVendor)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [workOrders]);

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

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.address1 || 'Unknown Property';
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
                  {getPropertyName(lease.propertyId)} • Ends {shortDate(lease.endDate)}
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
                  {getPropertyName(tenant.propertyId)} • 
                  <span className="text-red-400 ml-1">
                    {formatCurrency(tenant.balanceDue * 100)}
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
          {highPriorityWorkOrders.map((workOrder) => (
            <div key={workOrder.id} className="action-item">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--altus-text)]">
                  {getPropertyName(workOrder.propertyId)}
                </div>
                <div className="text-xs text-[var(--altus-muted)]">
                  {workOrder.summary}
                </div>
              </div>
              <div>
                <ActionButton 
                  size="sm" 
                  variant="primary"
                  onClick={() => console.info('Assign vendor', workOrder.id)}
                  data-testid={`assign-vendor-${workOrder.id}`}
                >
                  Assign Vendor
                </ActionButton>
              </div>
            </div>
          ))}
          {highPriorityWorkOrders.length === 0 && (
            <div className="text-sm text-[var(--altus-muted)] text-center py-4">
              No high priority work orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
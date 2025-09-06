// PriorityActionFeed.tsx - Genesis specification action feed with 3 sections
import React from 'react';
import { fmtDate, fmtMoney } from '../../../utils/format';
import { ActionButton } from './ActionButton';

interface ActionFeedData {
  delinquentsTop: Array<{
    tenantId: string;
    tenant: string;
    property: string;
    balance: number;
    daysOverdue: number;
  }>;
  leasesExpiring45: Array<{
    leaseId: string;
    tenant: string;
    property: string;
    endDate: string;
    daysToEnd: number;
  }>;
  workOrdersHotlist: Array<{
    woId: string;
    property: string;
    summary: string;
    priority: string;
    ageDays: number;
  }>;
}

interface PriorityActionFeedProps {
  actionFeed: ActionFeedData;
}

// Section component with empty state
function ActionSection({ 
  title, 
  icon, 
  items, 
  emptyMessage 
}: { 
  title: string;
  icon: string;
  items: React.ReactNode[];
  emptyMessage: string;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4 uppercase tracking-wide">
        <span>{icon}</span>
        {title}
      </h4>
      
      {items.length === 0 ? (
        <div className="bg-[var(--panel-elev)] rounded-lg p-6 text-center">
          <div className="text-[var(--text-dim)] text-sm">
            {emptyMessage}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items}
        </div>
      )}
    </div>
  );
}

// Individual action item
function ActionItem({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[var(--panel-elev)] rounded-lg p-4 border border-[var(--line)] ${className}`}>
      {children}
    </div>
  );
}

export function PriorityActionFeed({ actionFeed }: PriorityActionFeedProps) {
  // Delinquency alerts section
  const delinquencyItems = actionFeed.delinquentsTop.slice(0, 3).map((item) => (
    <ActionItem key={item.tenantId}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text)] truncate">
            {item.tenant}
          </div>
          <div className="text-sm text-[var(--text-dim)] truncate">
            {item.property}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-[var(--bad)]">
              {fmtMoney(item.balance)}
            </span>
            <span className="text-xs text-[var(--text-dim)]">
              • {item.daysOverdue} days overdue
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <ActionButton
            size="sm"
            variant="secondary"
            onClick={() => window.open(`/communications/send?tenant=${item.tenantId}&template=payment_reminder`, '_blank')}
          >
            Send Reminder
          </ActionButton>
          <ActionButton
            size="sm"
            variant="danger"
            onClick={() => window.open(`/legal/eviction?tenant=${item.tenantId}`, '_blank')}
          >
            Start Eviction
          </ActionButton>
        </div>
      </div>
    </ActionItem>
  ));

  // Lease renewals section
  const renewalItems = actionFeed.leasesExpiring45.slice(0, 3).map((item) => (
    <ActionItem key={item.leaseId}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text)] truncate">
            {item.tenant}
          </div>
          <div className="text-sm text-[var(--text-dim)] truncate">
            {item.property}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-[var(--warn)]">
              Expires {fmtDate(item.endDate)}
            </span>
            <span className="text-xs text-[var(--text-dim)]">
              • {item.daysToEnd} days
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <ActionButton
            size="sm"
            variant="secondary"
            onClick={() => window.open(`/leasing/renewal?lease=${item.leaseId}`, '_blank')}
          >
            Prepare Renewal
          </ActionButton>
          <ActionButton
            size="sm"
            onClick={() => window.open(`/leasing/vacancy?lease=${item.leaseId}`, '_blank')}
          >
            Do Not Renew
          </ActionButton>
        </div>
      </div>
    </ActionItem>
  ));

  // Maintenance hotlist section
  const maintenanceItems = actionFeed.workOrdersHotlist.slice(0, 3).map((item) => (
    <ActionItem key={item.woId}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text)] truncate">
            {item.summary}
          </div>
          <div className="text-sm text-[var(--text-dim)] truncate">
            {item.property}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm font-medium ${
              item.priority === 'Critical' ? 'text-[var(--bad)]' : 'text-[var(--warn)]'
            }`}>
              {item.priority}
            </span>
            <span className="text-xs text-[var(--text-dim)]">
              • {item.ageDays} days old
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <ActionButton
            size="sm"
            onClick={() => window.open(`/maintenance/assign-vendor?wo=${item.woId}`, '_blank')}
          >
            Assign Vendor
          </ActionButton>
        </div>
      </div>
    </ActionItem>
  ));

  return (
    <div className="space-y-6">
      <ActionSection
        title="Delinquency Alerts"
        icon="🆘"
        items={delinquencyItems}
        emptyMessage="No delinquent tenants. Great job on collections!"
      />
      
      <ActionSection
        title="Lease Renewals (≤45 days)"
        icon="⚠️"
        items={renewalItems}
        emptyMessage="No leases expiring soon. You're ahead of the game!"
      />
      
      <ActionSection
        title="Maintenance Hotlist"
        icon="🛠️"
        items={maintenanceItems}
        emptyMessage="No critical maintenance issues. All systems running smoothly!"
      />
    </div>
  );
}
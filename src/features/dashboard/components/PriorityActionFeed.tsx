// PriorityActionFeed.tsx - Genesis v2 specification with action buttons
import React from 'react';
import { Link } from 'wouter';
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

// Section component with empty states
function ActionSection({ 
  title, 
  icon, 
  children, 
  emptyMessage 
}: { 
  title: string;
  icon: string;
  children: React.ReactNode;
  emptyMessage: string;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4 uppercase tracking-wide">
        <span>{icon}</span>
        {title}
      </h4>
      {children}
    </div>
  );
}

// Individual action item wrapper
function ActionItem({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--panel-elev)] border border-[var(--line)] rounded-lg p-4 mb-3 last:mb-0">
      {children}
    </div>
  );
}

// Positive empty state component
function EmptyState({ message, icon }: { message: string; icon: string }) {
  return (
    <div className="bg-[var(--panel-elev)] rounded-lg p-6 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[var(--text)] text-sm font-medium">
        {message}
      </div>
    </div>
  );
}

export function PriorityActionFeed({ actionFeed }: PriorityActionFeedProps) {
  if (!actionFeed) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="bg-[var(--panel-elev)] h-4 w-32 mb-4 rounded animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, itemIndex) => (
                  <div key={itemIndex} className="bg-[var(--panel-elev)] rounded-lg p-4">
                    <div className="bg-[var(--panel-bg)] h-4 w-24 mb-2 rounded animate-pulse"></div>
                    <div className="bg-[var(--panel-bg)] h-3 w-32 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { delinquentsTop, leasesExpiring45, workOrdersHotlist } = actionFeed;

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
      <div className="space-y-6">
        {/* Delinquency Alerts */}
        <ActionSection
          title="Delinquency Alerts"
          icon="🆘"
          emptyMessage="No delinquent tenants. Great job on collections! 🎉"
        >
          {delinquentsTop.length === 0 ? (
            <EmptyState message="No delinquent tenants. Great job on collections!" icon="🎉" />
          ) : (
            delinquentsTop.slice(0, 3).map((item) => (
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
                      variant="secondary"
                      onClick={() => window.open(`/legal/eviction?tenant=${item.tenantId}`, '_blank')}
                    >
                      Start Eviction
                    </ActionButton>
                  </div>
                </div>
              </ActionItem>
            ))
          )}
        </ActionSection>

        {/* Lease Renewals */}
        <ActionSection
          title="Lease Renewals (≤45d)"
          icon="⚠️"
          emptyMessage="No leases expiring soon. You're ahead of the game! 🎯"
        >
          {leasesExpiring45.length === 0 ? (
            <EmptyState message="No leases expiring soon. You're ahead of the game!" icon="🎯" />
          ) : (
            leasesExpiring45.slice(0, 3).map((item) => (
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
                      onClick={() => window.open(`/leasing/renewal?lease=${item.leaseId}`, '_blank')}
                    >
                      Prepare Renewal
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(`/leasing/vacancy?lease=${item.leaseId}`, '_blank')}
                    >
                      Do Not Renew
                    </ActionButton>
                  </div>
                </div>
              </ActionItem>
            ))
          )}
        </ActionSection>

        {/* Maintenance Hotlist */}
        <ActionSection
          title="Maintenance Hotlist"
          icon="🛠️"
          emptyMessage="No critical maintenance issues. All systems running smoothly! ✨"
        >
          {workOrdersHotlist.length === 0 ? (
            <EmptyState message="No critical maintenance issues. All systems running smoothly! ✨" />
          ) : (
            workOrdersHotlist.slice(0, 3).map((item) => (
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
            ))
          )}
        </ActionSection>
      </div>
    </div>
  );
}
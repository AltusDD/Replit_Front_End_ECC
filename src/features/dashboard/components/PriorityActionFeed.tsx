// PriorityActionFeed.tsx - 3 priority queues with clear CTAs and positive empty states
import React from 'react';
import { Link } from 'wouter';
import { fmtMoney, fmtDate } from '../../../utils/format';

interface ActionFeedData {
  delinquentsTop: Array<{
    tenantId: number;
    tenant: string;
    property: string;
    balance: number;
    daysOverdue: number;
  }>;
  leasesExpiring45: Array<{
    leaseId: number;
    tenant: string;
    property: string;
    endDate: string;
    daysToEnd: number;
  }>;
  workOrdersHotlist: Array<{
    woId: number;
    property: string;
    summary: string;
    priority: string;
    ageDays: number;
  }>;
}

interface PriorityActionFeedProps {
  actionFeed: ActionFeedData;
}

// Action item component with CTA
function ActionItem({ 
  children, 
  href, 
  priority = 'normal' 
}: { 
  children: React.ReactNode;
  href: string;
  priority?: 'normal' | 'high' | 'critical';
}) {
  const priorityClasses = {
    normal: 'border-[var(--line)] hover:border-[var(--text-dim)]',
    high: 'border-[var(--warn)]/40 hover:border-[var(--warn)]',
    critical: 'border-[var(--bad)]/40 hover:border-[var(--bad)]',
  };
  
  return (
    <Link href={href}>
      <div className={`p-3 rounded-lg border ${priorityClasses[priority]} bg-[var(--panel-elev)] hover:bg-[var(--panel-elev-hover)] transition-colors cursor-pointer`}>
        {children}
      </div>
    </Link>
  );
}

// Priority badge
function PriorityBadge({ priority }: { priority: string }) {
  const priorityConfig: Record<string, { text: string; classes: string }> = {
    Critical: { text: 'Critical', classes: 'bg-[var(--bad)] text-white' },
    High: { text: 'High', classes: 'bg-[var(--warn)] text-[var(--altus-black)]' },
    Medium: { text: 'Medium', classes: 'bg-[var(--neutral)] text-white' },
    Low: { text: 'Low', classes: 'bg-[var(--text-dim)] text-white' },
  };
  
  const config = priorityConfig[priority] || priorityConfig.Medium;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.classes}`}>
      {config.text}
    </span>
  );
}

// Positive empty state component
function EmptyState({ 
  title, 
  message, 
  icon 
}: { 
  title: string;
  message: string;
  icon: string;
}) {
  return (
    <div className="p-6 text-center bg-[var(--panel-elev)] rounded-lg border border-[var(--line)]">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-sm font-medium text-[var(--text)] mb-1">{title}</h4>
      <p className="text-xs text-[var(--text-dim)]">{message}</p>
    </div>
  );
}

// Section header with count
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wide">
        {title}
      </h3>
      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-full">
        {count}
      </span>
    </div>
  );
}

export function PriorityActionFeed({ actionFeed }: PriorityActionFeedProps) {
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Priority Action Feed</h2>
        <p className="text-sm text-[var(--text-dim)]">
          Real-time alerts requiring immediate attention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delinquent Tenants Queue */}
        <div>
          <SectionHeader 
            title="Delinquent Tenants" 
            count={actionFeed.delinquentsTop.length} 
          />
          
          <div className="space-y-3">
            {actionFeed.delinquentsTop.length === 0 ? (
              <EmptyState
                title="All Current"
                message="No delinquent tenants requiring collection action"
                icon="✅"
              />
            ) : (
              actionFeed.delinquentsTop.map((delinquent) => (
                <ActionItem
                  key={delinquent.tenantId}
                  href={`/card/tenant/${delinquent.tenantId}`}
                  priority={delinquent.daysOverdue > 30 ? 'critical' : 'high'}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--text)] mb-1">
                        {delinquent.tenant}
                      </div>
                      <div className="text-xs text-[var(--text-dim)] mb-2">
                        {delinquent.property}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--bad)]">
                          {fmtMoney(delinquent.balance)}
                        </span>
                        <span className="text-xs text-[var(--text-dim)]">
                          {delinquent.daysOverdue} days overdue
                        </span>
                      </div>
                    </div>
                    <div className="ml-2">
                      <div className={`w-3 h-3 rounded-full ${
                        delinquent.daysOverdue > 30 ? 'bg-[var(--bad)]' : 'bg-[var(--warn)]'
                      }`} />
                    </div>
                  </div>
                </ActionItem>
              ))
            )}
            
            {actionFeed.delinquentsTop.length > 0 && (
              <Link href="/portfolio/tenants?filter=delinquent">
                <button className="w-full p-2 text-xs text-[var(--altus-gold)] border border-[var(--altus-gold)]/40 rounded-lg hover:bg-[var(--altus-gold)]/10 transition-colors">
                  View All Delinquent Accounts →
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Expiring Leases Queue */}
        <div>
          <SectionHeader 
            title="Expiring Leases" 
            count={actionFeed.leasesExpiring45.length} 
          />
          
          <div className="space-y-3">
            {actionFeed.leasesExpiring45.length === 0 ? (
              <EmptyState
                title="All Renewed"
                message="No leases expiring in the next 45 days"
                icon="📋"
              />
            ) : (
              actionFeed.leasesExpiring45.map((lease) => (
                <ActionItem
                  key={lease.leaseId}
                  href={`/card/lease/${lease.leaseId}`}
                  priority={lease.daysToEnd <= 14 ? 'high' : 'normal'}
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--text)] mb-1">
                      {lease.tenant}
                    </div>
                    <div className="text-xs text-[var(--text-dim)] mb-2">
                      {lease.property}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[var(--text)]">
                        Expires {fmtDate(lease.endDate)}
                      </span>
                      <span className={`text-xs ${
                        lease.daysToEnd <= 14 ? 'text-[var(--bad)]' : 'text-[var(--warn)]'
                      }`}>
                        ({lease.daysToEnd} days)
                      </span>
                    </div>
                  </div>
                </ActionItem>
              ))
            )}
            
            {actionFeed.leasesExpiring45.length > 0 && (
              <Link href="/portfolio/leases?status=expiring">
                <button className="w-full p-2 text-xs text-[var(--altus-gold)] border border-[var(--altus-gold)]/40 rounded-lg hover:bg-[var(--altus-gold)]/10 transition-colors">
                  View All Expiring Leases →
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Work Orders Hotlist */}
        <div>
          <SectionHeader 
            title="Work Order Hotlist" 
            count={actionFeed.workOrdersHotlist.length} 
          />
          
          <div className="space-y-3">
            {actionFeed.workOrdersHotlist.length === 0 ? (
              <EmptyState
                title="All Clear"
                message="No critical work orders requiring immediate attention"
                icon="🔧"
              />
            ) : (
              actionFeed.workOrdersHotlist.map((wo) => (
                <ActionItem
                  key={wo.woId}
                  href={`/card/workorder/${wo.woId}`}
                  priority={wo.priority === 'Critical' ? 'critical' : 'high'}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-[var(--text)]">
                        {wo.summary}
                      </div>
                      <PriorityBadge priority={wo.priority} />
                    </div>
                    <div className="text-xs text-[var(--text-dim)] mb-2">
                      {wo.property}
                    </div>
                    <div className="text-xs font-medium text-[var(--text)]">
                      {wo.ageDays} {wo.ageDays === 1 ? 'day' : 'days'} old
                    </div>
                  </div>
                </ActionItem>
              ))
            )}
            
            {actionFeed.workOrdersHotlist.length > 0 && (
              <Link href="/maintenance?priority=high,critical&status=open">
                <button className="w-full p-2 text-xs text-[var(--altus-gold)] border border-[var(--altus-gold)]/40 rounded-lg hover:bg-[var(--altus-gold)]/10 transition-colors">
                  View All Critical Work Orders →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
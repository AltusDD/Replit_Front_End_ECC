// Priority Action Feed - 3 queues with clear CTAs

import { Link } from 'wouter';
import { fmtDate, fmtMoney } from '@/utils/format';
import type { DashboardData } from '../hooks/useDashboardData';

interface PriorityActionFeedProps {
  actionFeed: DashboardData['actionFeed'];
}

// Section header component
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
        {title}
        <span className="ml-2 text-xs text-[var(--text-dim)]">({count})</span>
      </h3>
      <div className="h-px bg-[var(--line)]" />
    </div>
  );
}

// Empty state component
function EmptyState({ title, message, icon }: { title: string; message: string; icon: string }) {
  return (
    <div className="text-center py-6 px-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-[var(--good)] mb-1">{title}</div>
      <div className="text-xs text-[var(--text-dim)]">{message}</div>
    </div>
  );
}

// Action item wrapper
function ActionItem({ 
  children, 
  href, 
  priority = 'medium' 
}: { 
  children: React.ReactNode; 
  href?: string; 
  priority?: 'low' | 'medium' | 'high' | 'critical';
}) {
  const priorityColors = {
    low: 'var(--neutral)',
    medium: 'var(--warn)',
    high: 'var(--warn)',
    critical: 'var(--bad)',
  };
  
  const content = (
    <div 
      className="p-3 rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] hover:bg-[var(--panel-elev)] transition-colors"
      style={{ borderLeftColor: priorityColors[priority], borderLeftWidth: '3px' }}
    >
      {children}
    </div>
  );
  
  return href ? <Link href={href}>{content}</Link> : content;
}

// Action button component
function ActionButton({ 
  children, 
  href, 
  variant = 'primary' 
}: { 
  children: React.ReactNode; 
  href: string; 
  variant?: 'primary' | 'secondary';
}) {
  const baseClasses = "inline-flex items-center px-3 py-1 text-xs font-medium rounded transition-colors";
  const variantClasses = variant === 'primary'
    ? "bg-[var(--altus-gold)] text-[var(--altus-black)] hover:opacity-90"
    : "bg-[var(--panel-elev)] text-[var(--text-dim)] border border-[var(--line)] hover:text-[var(--text)]";
  
  return (
    <Link href={href}>
      <button className={`${baseClasses} ${variantClasses}`}>
        {children}
      </button>
    </Link>
  );
}

export function PriorityActionFeed({ actionFeed }: PriorityActionFeedProps) {
  return (
    <div className="ecc-panel p-6" data-testid="priority-action-feed">
      <div className="mb-6">
        <h2 className="ecc-panel__title text-lg mb-2">
          Priority Actions
        </h2>
        <p className="text-sm text-[var(--text-dim)]">
          Real-time alerts requiring immediate attention
        </p>
      </div>

      <div className="space-y-6">
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
              actionFeed.delinquentsTop.slice(0,3).map((delinquent) => (
                <ActionItem
                  key={delinquent.tenantId}
                  href={`/card/tenant/${delinquent.tenantId}`}
                  priority={delinquent.daysOverdue > 30 ? 'critical' : 'high'}
                >
                  <div className="flex items-start justify-between mb-3">
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
                  </div>
                  
                  <div className="flex gap-2">
                    <ActionButton
                      href={`/communication?tenant_id=${delinquent.tenantId}&template=late_notice`}
                      variant="primary"
                    >
                      Send Reminder
                    </ActionButton>
                    <ActionButton
                      href={`/legal?tenant_id=${delinquent.tenantId}&action=eviction`}
                      variant="secondary"
                    >
                      Start Eviction
                    </ActionButton>
                  </div>
                </ActionItem>
              ))
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
              actionFeed.leasesExpiring45.slice(0,3).map((lease) => (
                <ActionItem
                  key={lease.leaseId}
                  href={`/card/lease/${lease.leaseId}`}
                  priority={lease.daysToEnd <= 15 ? 'high' : 'medium'}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--text)] mb-1">
                        {lease.tenant}
                      </div>
                      <div className="text-xs text-[var(--text-dim)] mb-2">
                        {lease.property}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--warn)]">
                          Expires {fmtDate(lease.endDate)}
                        </span>
                        <span className="text-xs text-[var(--text-dim)]">
                          {lease.daysToEnd} days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ActionButton
                      href="/leases?expiring=45"
                      variant="primary"
                    >
                      Prepare Renewal
                    </ActionButton>
                    <ActionButton
                      href="/leases?decision=non_renew"
                      variant="secondary"
                    >
                      Do Not Renew
                    </ActionButton>
                  </div>
                </ActionItem>
              ))
            )}
          </div>
        </div>

        {/* Maintenance Hotlist Queue */}
        <div>
          <SectionHeader 
            title="Maintenance Hotlist" 
            count={actionFeed.workOrdersHotlist.length} 
          />
          
          <div className="space-y-3">
            {actionFeed.workOrdersHotlist.length === 0 ? (
              <EmptyState
                title="All Assigned"
                message="No critical work orders requiring immediate attention"
                icon="🔧"
              />
            ) : (
              actionFeed.workOrdersHotlist.slice(0,3).map((wo) => (
                <ActionItem
                  key={wo.woId}
                  href={`/card/workorder/${wo.woId}`}
                  priority={wo.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical'}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--text)] mb-1">
                        {wo.property}
                      </div>
                      <div className="text-xs text-[var(--text-dim)] mb-2">
                        {wo.summary}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          wo.priority === 'Critical' ? 'text-[var(--bad)]' : 'text-[var(--warn)]'
                        }`}>
                          {wo.priority}
                        </span>
                        <span className="text-xs text-[var(--text-dim)]">
                          {wo.ageDays} days old
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ActionButton
                      href={`/maintenance?assign=1&workorder_id=${wo.woId}`}
                      variant="primary"
                    >
                      Assign Vendor
                    </ActionButton>
                  </div>
                </ActionItem>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
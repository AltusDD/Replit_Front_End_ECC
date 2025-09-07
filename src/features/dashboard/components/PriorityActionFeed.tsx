// Genesis Grade Priority Action Feed - Real-Time Alert System

import React from 'react';
import { ActionButton } from './ActionButton';
import type { ActionFeedItem } from '../hooks/useDashboardData';

interface PriorityActionFeedProps {
  actionFeed: ActionFeedItem[];
}

// Empty State Component
function EmptyState({ title, message, icon }: { title: string; message: string; icon: string }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-sm font-medium text-[var(--good)] mb-2">{title}</div>
      <div className="text-xs text-[var(--text-dim)]">{message}</div>
    </div>
  );
}

// Action Item Component
function ActionItem({ item }: { item: ActionFeedItem }) {
  const priorityClass = `action-item--${item.priority}`;
  
  return (
    <div className={`action-item ${priorityClass}`}>
      <div className="action-item__header">
        <div className="action-item__title">
          {item.title}
        </div>
      </div>
      
      <div className="action-item__meta">
        {item.subtitle}
      </div>
      
      <div className="text-xs text-[var(--text-dim)] mb-3">
        {item.meta}
      </div>
      
      <div className="action-item__actions">
        {item.actions.map((action, index) => (
          <ActionButton
            key={index}
            variant={action.variant}
            size="small"
            href={action.href}
          >
            {action.label}
          </ActionButton>
        ))}
      </div>
    </div>
  );
}

// Section Component
function ActionSection({ 
  title, 
  items, 
  emptyState 
}: { 
  title: string; 
  items: ActionFeedItem[]; 
  emptyState: { title: string; message: string; icon: string };
}) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
          {title}
          <span className="ml-2 text-xs text-[var(--text-dim)]">({items.length})</span>
        </h3>
        <div className="h-px bg-[var(--line)]" />
      </div>
      
      <div className="space-y-3">
        {items.length === 0 ? (
          <EmptyState {...emptyState} />
        ) : (
          items.map((item) => (
            <ActionItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export function PriorityActionFeed({ actionFeed = [] }: PriorityActionFeedProps) {
  // Group action items by type
  const delinquents = actionFeed.filter(item => item.type === 'delinquent');
  const leasesExpiring = actionFeed.filter(item => item.type === 'lease-expiring');
  const maintenance = actionFeed.filter(item => item.type === 'maintenance');

  return (
    <div className="ecc-panel p-6" data-testid="priority-action-feed">
      <div className="mb-6">
        <h2 className="ecc-panel__title">
          Priority Actions
        </h2>
        <p className="ecc-panel__subtitle">
          Real-time alerts requiring immediate attention
        </p>
      </div>

      <div className="action-feed">
        {/* Delinquent Tenants Section */}
        <ActionSection
          title="🆘 Delinquency Alerts"
          items={delinquents.slice(0, 3)}
          emptyState={{
            title: "All Current",
            message: "No delinquent tenants requiring collection action",
            icon: "✅"
          }}
        />

        {/* Expiring Leases Section */}
        <ActionSection
          title="⚠️ Lease Renewals"
          items={leasesExpiring.slice(0, 3)}
          emptyState={{
            title: "All Renewed",
            message: "No leases expiring in the next 45 days",
            icon: "📋"
          }}
        />

        {/* Maintenance Hotlist Section */}
        <ActionSection
          title="🛠️ Maintenance Hotlist"
          items={maintenance.slice(0, 3)}
          emptyState={{
            title: "All Assigned",
            message: "No critical work orders requiring immediate attention",
            icon: "🔧"
          }}
        />
      </div>
    </div>
  );
}
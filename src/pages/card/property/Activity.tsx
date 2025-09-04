import React, { useState } from 'react';
import { PropertyCardDTO } from '../types';

interface ActivityProps {
  data: PropertyCardDTO;
}

export default function Activity({ data }: ActivityProps) {
  const [filter, setFilter] = useState('all');

  // Sample activity data
  const activities = [
    {
      id: '1',
      type: 'payment',
      source: 'DoorLoop',
      title: 'Payment Received',
      description: 'John Smith (Unit 101) - January Rent Payment',
      amount: '$1,200.00',
      timestamp: '2024-01-01T10:30:00Z',
      icon: '💳'
    },
    {
      id: '2',
      type: 'communication',
      source: 'Email',
      title: 'Email Sent',
      description: 'Rent reminder sent to Sarah Johnson (Unit 102)',
      timestamp: '2024-01-01T09:15:00Z',
      icon: '📧'
    },
    {
      id: '3',
      type: 'maintenance',
      source: 'SMS',
      title: 'Work Order Created',
      description: 'Leaky faucet reported in Unit 101 - Assigned to ABC Plumbing',
      timestamp: '2023-12-31T16:45:00Z',
      icon: '🔧'
    },
    {
      id: '4',
      type: 'payment',
      source: 'DoorLoop',
      title: 'Payment Received',
      description: 'Sarah Johnson (Unit 102) - December Rent Payment',
      amount: '$1,350.00',
      timestamp: '2023-12-28T14:20:00Z',
      icon: '💳'
    },
    {
      id: '5',
      type: 'communication',
      source: 'Teams',
      title: 'Note Added',
      description: 'Property manager note: HVAC servicing scheduled for next week',
      timestamp: '2023-12-27T11:00:00Z',
      icon: '📝'
    },
    {
      id: '6',
      type: 'ledger',
      source: 'DoorLoop',
      title: 'Charge Applied',
      description: 'Late fee applied to Unit 103 account',
      amount: '$50.00',
      timestamp: '2023-12-26T08:30:00Z',
      icon: '📊'
    },
    {
      id: '7',
      type: 'maintenance',
      source: 'DoorLoop',
      title: 'Work Order Completed',
      description: 'Carpet cleaning completed in Unit 103',
      timestamp: '2023-12-25T15:15:00Z',
      icon: '✅'
    },
    {
      id: '8',
      type: 'communication',
      source: 'SMS',
      title: 'SMS Sent',
      description: 'Maintenance entry notification sent to Mike Wilson',
      timestamp: '2023-12-24T10:45:00Z',
      icon: '📱'
    }
  ];

  const filters = [
    { value: 'all', label: 'All Activity' },
    { value: 'payment', label: 'Payments' },
    { value: 'communication', label: 'Communications' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'ledger', label: 'Ledger Changes' }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'doorloop': return 'var(--gold)';
      case 'email': return 'var(--info)';
      case 'sms': return 'var(--success)';
      case 'teams': return 'var(--info)';
      default: return 'var(--text-subtle)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--gap-2)', flexWrap: 'wrap' }}>
        {filters.map(filterOption => (
          <button
            key={filterOption.value}
            onClick={() => setFilter(filterOption.value)}
            style={{
              background: filter === filterOption.value ? 'var(--gold)' : 'var(--surface-2)',
              color: filter === filterOption.value ? 'var(--bg)' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 16px',
              fontSize: 'var(--fs-14)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--t-fast) var(--ease)'
            }}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        {filteredActivities.length > 0 ? (
          <div>
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  padding: 'var(--gap-3)',
                  borderBottom: index < filteredActivities.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  gap: 'var(--gap-3)',
                  alignItems: 'flex-start'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--surface)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {activity.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-2)', marginBottom: '4px' }}>
                    <h4 style={{
                      fontSize: 'var(--fs-14)',
                      fontWeight: 600,
                      color: 'var(--text)',
                      margin: 0
                    }}>
                      {activity.title}
                    </h4>
                    <span style={{
                      background: getSourceBadgeColor(activity.source),
                      color: 'var(--bg)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: 'var(--fs-12)',
                      fontWeight: 600
                    }}>
                      {activity.source}
                    </span>
                    {activity.amount && (
                      <span style={{
                        color: 'var(--success)',
                        fontSize: 'var(--fs-14)',
                        fontWeight: 600,
                        marginLeft: 'auto'
                      }}>
                        {activity.amount}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: 'var(--fs-14)',
                    color: 'var(--text-subtle)',
                    margin: '0 0 8px 0',
                    lineHeight: 'var(--lh-normal)'
                  }}>
                    {activity.description}
                  </p>
                  <div style={{
                    fontSize: 'var(--fs-12)',
                    color: 'var(--text-muted)'
                  }}>
                    {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'var(--gap-4)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>📋</div>
            <div style={{ color: 'var(--text)', fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: '8px' }}>
              No Activity Found
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-14)' }}>
              No activities match the selected filter.
            </div>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 24px',
            fontSize: 'var(--fs-14)',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Load More Activity
          </button>
        </div>
      )}
    </div>
  );
}
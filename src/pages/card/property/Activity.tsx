import {} from '@/lib/ecc-resolvers';
import React from 'react';

export type ActivityItem = {
  id?: string | number;
  timestamp?: string;
  action?: string;
  user?: string;
  description?: string;
};

export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div className="ecc-object ecc-section opacity-70 p-4">No activity recorded.</div>;
  }
  
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.id ?? idx} className="ecc-object p-3 text-sm">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="font-medium">{item.action}</div>
              {item.description && <div className="opacity-70">{item.description}</div>}
            </div>
            <div className="text-xs opacity-60 shrink-0">
              {item.timestamp && new Date(item.timestamp).toLocaleDateString()}
            </div>
          </div>
          {item.user && <div className="text-xs opacity-60 mt-1">by {item.user}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Activity({ items }: { items: ActivityItem[] }) {
  return <ActivityList items={items} />;
}
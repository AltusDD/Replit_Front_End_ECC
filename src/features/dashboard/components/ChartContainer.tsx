// ChartContainer.tsx - Genesis specification chart frame component

import React from 'react';

export type TimeRange = '30d' | '90d' | '6m' | '12m';

interface ChartContainerProps {
  title: string;
  range?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  height?: 'fixed' | 'compact';
}

const RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '6m', label: '6 Months' },
  { value: '12m', label: '12 Months' },
];

export function ChartContainer({ 
  title, 
  range, 
  onRangeChange,
  rightSlot,
  children,
  height = 'fixed'
}: ChartContainerProps) {
  const heightClass = height === 'compact' ? 'h-[280px]' : 'h-[320px]';
  
  return (
    <div className="dash-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="dash-title text-lg">{title}</h3>
        <div className="flex items-center gap-3">
          {range && onRangeChange && (
            <select
              value={range}
              onChange={(e) => onRangeChange(e.target.value as TimeRange)}
              className="bg-[var(--altus-panel-2)] text-[var(--altus-text)] border border-[var(--altus-outline)] rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--altus-gold)] focus:border-transparent"
            >
              {RANGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {rightSlot}
        </div>
      </div>
      <div className="border-b border-[var(--altus-outline)] mx-6"></div>
      <div className={`p-6 pt-4 ${heightClass}`}>
        {children}
      </div>
    </div>
  );
}
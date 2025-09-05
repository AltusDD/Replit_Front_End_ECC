// src/features/dashboard/components/ChartContainer.tsx
import React from 'react';
import '../../../styles/Dashboard.css';

export type TimeRange = '30d' | '90d' | '6m' | '12m';

interface ChartContainerProps {
  title: string;
  range?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
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
  children 
}: ChartContainerProps) {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dash-title text-lg">{title}</h3>
        <div className="flex items-center gap-3">
          {range && onRangeChange && (
            <select
              value={range}
              onChange={(e) => onRangeChange(e.target.value as TimeRange)}
              className="bg-[var(--altus-grey-700)] text-[var(--altus-text)] border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--altus-gold)] focus:border-transparent"
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
      <div className="border-b border-gray-700 mb-4"></div>
      <div className="min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
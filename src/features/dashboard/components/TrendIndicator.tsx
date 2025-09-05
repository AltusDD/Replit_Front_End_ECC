// TrendIndicator.tsx - Genesis specification trend indicators
import React from 'react';

interface TrendIndicatorProps {
  value: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export function TrendIndicator({ value, showValue = true, size = 'sm' }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = Math.abs(value) < 0.1;
  
  const iconSize = size === 'sm' ? 'text-sm' : 'text-base';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  if (isNeutral) {
    return (
      <div className="flex items-center gap-1 trend-neutral">
        <span className={`${iconSize}`}>•</span>
        {showValue && <span className={`${textSize} font-medium`}>—</span>}
      </div>
    );
  }
  
  const colorClass = isPositive ? 'trend-up' : 'trend-down';
  const icon = isPositive ? '▲' : '▼';
  const displayValue = showValue ? `${isPositive ? '+' : ''}${value.toFixed(1)}%` : '';
  
  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <span className={`${iconSize}`}>{icon}</span>
      {showValue && <span className={`${textSize} font-medium`}>{displayValue}</span>}
    </div>
  );
}
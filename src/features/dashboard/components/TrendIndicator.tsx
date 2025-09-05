// TrendIndicator.tsx - Genesis specification trend component

import React from 'react';

interface TrendIndicatorProps {
  value: number;
}

export function TrendIndicator({ value }: TrendIndicatorProps) {
  if (value > 0) {
    return (
      <span 
        className="text-[var(--altus-good)] inline-flex items-center text-sm font-medium"
        aria-label={`up ${Math.abs(value).toFixed(1)} percent`}
      >
        ▲ {value.toFixed(1)}%
      </span>
    );
  }
  
  if (value < 0) {
    return (
      <span 
        className="text-[var(--altus-bad)] inline-flex items-center text-sm font-medium"
        aria-label={`down ${Math.abs(value).toFixed(1)} percent`}
      >
        ▼ {Math.abs(value).toFixed(1)}%
      </span>
    );
  }

  return (
    <span 
      className="text-[var(--altus-muted)] inline-flex items-center text-sm"
      aria-label="no change"
    >
      • 0.0%
    </span>
  );
}
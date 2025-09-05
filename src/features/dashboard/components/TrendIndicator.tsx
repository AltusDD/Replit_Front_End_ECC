// src/features/dashboard/components/TrendIndicator.tsx
import React from 'react';

interface TrendIndicatorProps {
  value: number;
}

export function TrendIndicator({ value }: TrendIndicatorProps) {
  if (value > 0) {
    return (
      <span 
        className="trend--up inline-flex items-center"
        aria-label={`up ${Math.abs(value).toFixed(1)} percent`}
      >
        ▲ {value.toFixed(1)}%
      </span>
    );
  }
  
  if (value < 0) {
    return (
      <span 
        className="trend--down inline-flex items-center"
        aria-label={`down ${Math.abs(value).toFixed(1)} percent`}
      >
        ▼ {Math.abs(value).toFixed(1)}%
      </span>
    );
  }

  return (
    <span 
      className="text-[var(--altus-muted)] inline-flex items-center"
      aria-label="no change"
    >
      • 0.0%
    </span>
  );
}
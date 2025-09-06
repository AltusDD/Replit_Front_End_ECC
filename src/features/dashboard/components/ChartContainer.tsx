// ChartContainer.tsx - Genesis specification consistent panel header with controls slot
import React from 'react';

interface ChartContainerProps {
  title: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ 
  title, 
  controls,
  children,
  className = ''
}: ChartContainerProps) {
  return (
    <div className={`ecc-panel ${className}`}>
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        {controls && (
          <div className="flex items-center gap-3">
            {controls}
          </div>
        )}
      </div>
      {controls && <div className="border-b border-[var(--line)] mx-6"></div>}
      <div className="p-6 pt-4">
        {children}
      </div>
    </div>
  );
}
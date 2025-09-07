// Genesis Grade Chart Container - Sophisticated Data Visualization Wrapper

import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ChartContainer({ 
  title, 
  subtitle, 
  children, 
  actions,
  className = '' 
}: ChartContainerProps) {
  return (
    <div className={`chart-container ${className}`}>
      <div className="chart-container__header">
        <div>
          <h3 className="chart-container__title">{title}</h3>
          {subtitle && (
            <p className="chart-container__subtitle">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="chart-container__actions">
            {actions}
          </div>
        )}
      </div>
      
      <div className="chart-container__content">
        {children}
      </div>
    </div>
  );
}
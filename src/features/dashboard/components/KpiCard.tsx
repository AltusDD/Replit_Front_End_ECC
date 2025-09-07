// Genesis Grade KPI Card - Individual Metric Display

import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  metric?: string;
  isLoading: boolean;
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, metric, isLoading, icon }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="kpi-card">
        <div className="skeleton-shimmer">
          <div className="skeleton h-4 w-20 mb-2"></div>
          <div className="skeleton h-8 w-16 mb-1"></div>
          {metric && <div className="skeleton h-3 w-12"></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-card">
      {icon && <div className="kpi-card__icon">{icon}</div>}
      <div className="kpi-card__title">{title}</div>
      <div className="kpi-card__value">{value}</div>
      {metric && <div className="kpi-card__metric">{metric}</div>}
    </div>
  );
}
// Genesis Grade KPI Card - Individual Metric Display with Chart Support

import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface KpiCardProps {
  title: string;
  value: string;
  metric?: string;
  isLoading: boolean;
  icon?: React.ReactNode;
  chartType?: 'donut' | 'sparkline';
  chartData?: ChartData[];
}

export function KpiCard({ title, value, metric, isLoading, icon, chartType, chartData }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="kpi-card">
        <div className="skeleton-shimmer">
          <div className="skeleton h-4 w-20 mb-2"></div>
          <div className="skeleton h-8 w-16 mb-1"></div>
          {metric && <div className="skeleton h-3 w-12"></div>}
          {chartType && <div className="skeleton h-16 w-16 rounded-full ml-auto"></div>}
        </div>
      </div>
    );
  }

  const renderChart = () => {
    if (!chartType || !chartData?.length) return null;

    if (chartType === 'donut') {
      return (
        <div className="kpi-card__chart">
          <ResponsiveContainer width={60} height={60}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={18}
                outerRadius={28}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || 'var(--altus-gold)'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (chartType === 'sparkline') {
      return (
        <div className="kpi-card__chart">
          <ResponsiveContainer width={80} height={40}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--altus-gold)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="kpi-card">
      <div className="kpi-card__content">
        <div className="kpi-card__text">
          {icon && <div className="kpi-card__icon">{icon}</div>}
          <div className="kpi-card__title">{title}</div>
          <div className="kpi-card__value">{value}</div>
          {metric && <div className="kpi-card__metric">{metric}</div>}
        </div>
        {renderChart()}
      </div>
    </div>
  );
}
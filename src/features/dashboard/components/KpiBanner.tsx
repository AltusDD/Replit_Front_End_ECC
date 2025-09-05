// KpiBanner.tsx - Genesis specification KPI component with sparklines and deep links
import React from 'react';
import { TrendIndicator } from './TrendIndicator';
import { type DashboardData } from '../hooks/useDashboardData';
import { fmtMoney, fmtPct, fmtDays } from '../utils/formatDashboard';

interface KpiBannerProps {
  data: DashboardData;
}

// Simple sparkline component for KPI background
function Sparkline({ data, color = 'var(--altus-gold)' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="sparkline">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export function KpiBanner({ data }: KpiBannerProps) {
  const { kpis, series } = data;
  
  // Generate sparkline data from series with safety checks
  const occupancySparkline = series?.months?.map(m => m.occupancyPct * 100) || [];
  const noiSparkline = series?.months?.map(m => (m.income - m.expenses) / 100) || []; // Convert cents to dollars
  
  const kpiCards = [
    {
      label: 'Portfolio Occupancy',
      value: fmtPct(kpis.occupancyPct),
      trend: kpis.trends.occupancyPct,
      to: '/portfolio/units?status=vacant',
      testId: 'kpi-occupancy',
      sparkline: occupancySparkline,
    },
    {
      label: 'Avg Turn Time',
      value: fmtDays(kpis.avgTurnDays),
      trend: kpis.trends.avgTurnDays,
      to: '/reports/turns',
      testId: 'kpi-turn-time',
      sparkline: null,
    },
    {
      label: 'Rent Collection Rate',
      value: fmtPct(kpis.collectionRatePct),
      trend: kpis.trends.collectionRatePct,
      to: '/portfolio/tenants?type=delinquent',
      testId: 'kpi-collection',
      sparkline: null,
    },
    {
      label: 'High-Priority WOs',
      value: kpis.highPriorityWorkOrders.toString(),
      trend: kpis.trends.highPriorityWorkOrders,
      to: '/construction?priority=high',
      testId: 'kpi-work-orders',
      sparkline: null,
    },
    {
      label: 'NOI (MTD)',
      value: fmtMoney(kpis.noiMTD, 2),
      trend: kpis.trends.noiMTD,
      to: '/reports/pnl?period=mtd',
      testId: 'kpi-noi',
      sparkline: noiSparkline,
    },
  ];

  return (
    <div className="kpi-grid">
      {kpiCards.map((kpi) => (
        <a
          key={kpi.testId}
          href={kpi.to}
          className="kpi-card dash-card cursor-pointer hover:bg-[var(--altus-panel-2)] transition-colors"
          data-testid={kpi.testId}
          aria-label={`${kpi.label}: ${kpi.value}`}
          tabIndex={0}
        >
          {kpi.sparkline && (
            <Sparkline data={kpi.sparkline} />
          )}
          
          <div className="relative z-10">
            <div className="text-xs text-[var(--altus-muted)] uppercase tracking-wide font-medium mb-1">
              {kpi.label}
            </div>
            <div className="kpi-value text-[var(--altus-text)] mb-1">
              {kpi.value}
            </div>
            <div className="kpi-meta">
              <TrendIndicator value={kpi.trend} />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
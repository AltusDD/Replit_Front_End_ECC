// Genesis Grade KPI Ticker - Portfolio Health at a Glance

import React from 'react';
import { Link } from 'wouter';
import type { DashboardKPIs } from '../hooks/useDashboardData';

interface KpiTickerProps {
  kpis: DashboardKPIs;
}

// Donut Chart Component for Occupancy
function DonutChart({ percentage }: { percentage: number }) {
  const radius = 22;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="donut-chart relative w-12 h-12">
      <svg width="48" height="48" className="transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="donut-chart__track"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="donut-chart__value"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="donut-chart__label">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}

// Sparkline Component for Collections Trend
function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  
  const width = 60;
  const height = 20;
  const padding = 2;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        points={points}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Individual KPI Card Component
function KpiCard({
  title,
  value,
  subtitle,
  href,
  visual,
  testId
}: {
  title: string;
  value: string | number;
  subtitle: string;
  href: string;
  visual?: React.ReactNode;
  testId: string;
}) {
  return (
    <Link href={href}>
      <div 
        className="ecc-kpi p-4 rounded-xl cursor-pointer" 
        role="button" 
        tabIndex={0}
        data-testid={testId}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="ecc-kpi__title mb-2">{title}</div>
            <div className="ecc-kpi__value mb-1">{value}</div>
            <div className="ecc-kpi__trend text-xs text-[var(--text-dim)]">
              {subtitle}
            </div>
          </div>
          {visual && (
            <div className="ml-4 flex-shrink-0">
              {visual}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function KpiTicker({ kpis }: KpiTickerProps) {
  // Mock sparkline data for collections trend
  const collectionsSparkline = [92, 89, 94, 91, 96, 88, kpis.collectionsRatePct];
  
  return (
    <div className="kpi-grid" data-testid="kpi-ticker">
      {/* Portfolio Occupancy with Donut Chart */}
      <KpiCard
        title="Portfolio Occupancy"
        value={`${kpis.occupancyPct.toFixed(1)}%`}
        subtitle="vs 92.8% last month"
        href="/portfolio/properties?filter=occupancy"
        visual={<DonutChart percentage={kpis.occupancyPct} />}
        testId="kpi-occupancy"
      />
      
      {/* Rent Ready / Vacant Units */}
      <KpiCard
        title="Rent Ready Units"
        value={kpis.rentReadyVacant.ready}
        subtitle={`of ${kpis.rentReadyVacant.vacant} vacant units`}
        href="/portfolio/units?status=vacant&rent_ready=true"
        testId="kpi-rent-ready"
      />
      
      {/* Collections Rate with Sparkline */}
      <KpiCard
        title="Collections MTD"
        value={`${kpis.collectionsRatePct.toFixed(1)}%`}
        subtitle="daily collections trend"
        href="/accounting?period=mtd"
        visual={<Sparkline data={collectionsSparkline} />}
        testId="kpi-collections"
      />
      
      {/* Critical Work Orders */}
      <KpiCard
        title="Critical Work Orders"
        value={kpis.openCriticalWO}
        subtitle="high priority items open"
        href="/maintenance?priority=high,critical"
        testId="kpi-work-orders"
      />
    </div>
  );
}
// KpiTicker.tsx - Genesis v2 specification actionable KPIs with visuals
import React from 'react';
import { fmtPct } from '../../../utils/format';

interface KpiData {
  occupancyPct: number;
  rentReadyVacant: { ready: number; vacant: number };
  collectionsRatePct: number;
  openCriticalWO: number;
  noiMTD: number;
}

interface KpiTickerProps {
  kpis: KpiData;
}

// Mini donut chart for percentages
function MiniDonut({ percentage, size = 40 }: { percentage: number; size?: number }) {
  const circumference = 2 * Math.PI * 14;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return (
    <div className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={14}
          stroke="var(--line)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={14}
          stroke="var(--good)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-bold text-[var(--text)]">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

// Simple sparkline for trends
function MiniSparkline({ trend }: { trend: number }) {
  const points = Array.from({ length: 7 }, (_, i) => {
    const base = 50;
    const variation = (Math.sin(i * 0.8) * 10) + (trend * i * 2);
    return Math.max(10, Math.min(90, base + variation));
  });
  
  const path = points.map((point, i) => {
    const x = (i / (points.length - 1)) * 40;
    const y = 20 - ((point - 10) / 80) * 20;
    return i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="40" height="20" className="opacity-60">
      <path
        d={path}
        stroke={trend >= 0 ? 'var(--good)' : 'var(--bad)'}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Trend badge
function TrendBadge({ value }: { value: number }) {
  const isPositive = value > 0;
  const color = isPositive ? 'var(--good)' : 'var(--bad)';
  const icon = isPositive ? '▲' : '▼';
  
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      <span className="text-xs">{icon}</span>
      <span className="text-xs font-medium">{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
}

export function KpiTicker({ kpis }: KpiTickerProps) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-4">
            <div className="bg-[var(--panel-elev)] h-4 w-20 mb-2 rounded animate-pulse"></div>
            <div className="bg-[var(--panel-elev)] h-8 w-16 mb-2 rounded animate-pulse"></div>
            <div className="bg-[var(--panel-elev)] h-3 w-24 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpiItems = [
    {
      id: 'occupancy',
      label: 'Occupancy',
      value: fmtPct(kpis.occupancyPct, 1),
      secondary: `of all units`,
      route: '/portfolio/units?status=occupied',
      visual: <MiniDonut percentage={kpis.occupancyPct} />,
      trend: 2.3,
    },
    {
      id: 'vacant',
      label: 'Rent-Ready / Vacant',
      value: `${kpis.rentReadyVacant.ready} / ${kpis.rentReadyVacant.vacant}`,
      secondary: `units available`,
      route: '/portfolio/units?status=vacant',
      visual: (
        <div className="text-2xl font-bold text-[var(--warn)]">
          {kpis.rentReadyVacant.ready}
        </div>
      ),
      trend: -1.2,
    },
    {
      id: 'collections',
      label: 'Collections (MTD)',
      value: fmtPct(kpis.collectionsRatePct, 1),
      secondary: 'current tenants',
      route: '/accounting?scope=mtd&filter=unpaid',
      visual: <MiniDonut percentage={kpis.collectionsRatePct} />,
      trend: 0.8,
    },
    {
      id: 'criticalwo',
      label: 'Critical WOs',
      value: kpis.openCriticalWO.toString(),
      secondary: 'open issues',
      route: '/construction?priority=high',
      visual: (
        <div className="text-2xl font-bold text-[var(--bad)]">
          {kpis.openCriticalWO}
        </div>
      ),
      trend: -0.5,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiItems.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--panel-elev)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--altus-gold)] focus:ring-offset-2 focus:ring-offset-[var(--altus-black)]"
          onClick={() => window.open(kpi.route, '_blank')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.open(kpi.route, '_blank');
            }
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide font-medium mb-1">
                {kpi.label}
              </div>
              <div className="text-2xl font-bold text-[var(--text)] mb-1">
                {kpi.value}
              </div>
              <div className="text-xs text-[var(--text-dim)]">
                {kpi.secondary}
              </div>
            </div>
            <div className="ml-3 flex-shrink-0">
              {kpi.visual}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <TrendBadge value={kpi.trend} />
            <MiniSparkline trend={kpi.trend} />
          </div>
        </div>
      ))}
    </div>
  );
}
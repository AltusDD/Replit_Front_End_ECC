// KpiBanner.tsx - Genesis specification with live data, trends, and actionable routing
import React from 'react';
import { fmtMoney, fmtPct, fmtDays } from '../../../utils/format';
import { TrendIndicator } from './TrendIndicator';
import { Link } from 'wouter';

interface KpisData {
  occupancyPct: number;
  avgTurnDays: number;
  collectionRatePct: number;
  openHighWorkOrders: number;
  noiMTD: number;
  trends: {
    occupancyPct: number;
    avgTurnDays: number;
    collectionRatePct: number;
    openHighWorkOrders: number;
    noiMTD: number;
  };
}

interface KpiBannerProps {
  kpis: KpisData;
}

// Sparkline SVG component for KPI trends
function Sparkline({ data, color = 'var(--altus-gold)' }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  
  const width = 40;
  const height = 20;
  const padding = 2;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  if (range === 0) {
    // Flat line
    const y = height / 2;
    return (
      <svg width={width} height={height} className="inline-block ml-2">
        <line 
          x1={padding} 
          y1={y} 
          x2={width - padding} 
          y2={y} 
          stroke={color} 
          strokeWidth="1.5" 
          fill="none"
        />
      </svg>
    );
  }
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Generate sample sparkline data based on KPI value
function generateSparklineData(baseValue: number, trend: number): number[] {
  const points = 7; // Last 7 data points
  const data: number[] = [];
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const trendEffect = trend * progress * 0.1; // 10% of trend value
    const randomVariation = (Math.random() - 0.5) * baseValue * 0.05; // 5% random variation
    const value = baseValue + trendEffect + randomVariation;
    data.push(Math.max(0, value));
  }
  
  return data;
}

export function KpiBanner({ kpis }: KpiBannerProps) {
  const kpiItems = [
    {
      id: 'occupancy',
      label: 'Occupancy Rate',
      value: fmtPct(kpis.occupancyPct, 1),
      trend: kpis.trends.occupancyPct,
      route: '/portfolio/properties?filter=occupancy',
      sparklineData: generateSparklineData(kpis.occupancyPct, kpis.trends.occupancyPct),
    },
    {
      id: 'turnover',
      label: 'Avg Turn Days',
      value: fmtDays(kpis.avgTurnDays),
      trend: kpis.trends.avgTurnDays,
      route: '/portfolio/units?filter=vacant',
      sparklineData: generateSparklineData(kpis.avgTurnDays, kpis.trends.avgTurnDays),
    },
    {
      id: 'collections',
      label: 'Collection Rate',
      value: fmtPct(kpis.collectionRatePct, 1),
      trend: kpis.trends.collectionRatePct,
      route: '/accounting?filter=delinquent',
      sparklineData: generateSparklineData(kpis.collectionRatePct, kpis.trends.collectionRatePct),
    },
    {
      id: 'workorders',
      label: 'High Priority WOs',
      value: kpis.openHighWorkOrders.toString(),
      trend: kpis.trends.openHighWorkOrders,
      route: '/maintenance?filter=high_priority',
      sparklineData: generateSparklineData(kpis.openHighWorkOrders, kpis.trends.openHighWorkOrders),
    },
    {
      id: 'noi',
      label: 'NOI MTD',
      value: fmtMoney(kpis.noiMTD),
      trend: kpis.trends.noiMTD,
      route: '/analytics?view=financial',
      sparklineData: generateSparklineData(kpis.noiMTD / 1000, kpis.trends.noiMTD), // Scale down for sparkline
    },
  ];

  return (
    <div className="kpi-banner">
      {kpiItems.map((kpi) => (
        <Link key={kpi.id} href={kpi.route}>
          <div 
            className="ecc-kpi"
            role="button"
            tabIndex={0}
            aria-label={`${kpi.label}: ${kpi.value}, trend: ${kpi.trend > 0 ? 'up' : 'down'} ${Math.abs(kpi.trend).toFixed(1)}%`}
          >
            <div className="small-label mb-1">{kpi.label}</div>
            <div className="number-lg mb-2">{kpi.value}</div>
            <div className="flex items-center justify-between">
              <TrendIndicator value={kpi.trend} />
              <Sparkline 
                data={kpi.sparklineData} 
                color={kpi.trend >= 0 ? 'var(--chart-green)' : 'var(--chart-red)'} 
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
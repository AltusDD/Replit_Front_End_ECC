// KpiTicker.tsx - 4 actionable KPIs with donut/sparkline, deep links
import React from 'react';
import { Link } from 'wouter';
import { fmtPct, fmtMoney } from '../../../utils/format';

interface KpiTickerProps {
  kpis: {
    occupancyPct: number;
    rentReadyVacant: { ready: number; vacant: number };
    collectionsRatePct: number;
    openCriticalWO: number;
    noiMTD: number;
  };
}

// Simple donut chart component
function DonutChart({ percentage, size = 48 }: { percentage: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--line)"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--altus-gold)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-xs font-bold text-[var(--text)]">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

// Simple sparkline component for collections
function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="60" height="20" className="ml-2">
      <polyline
        points={points}
        fill="none"
        stroke="var(--good)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Individual KPI card component
function KpiCard({ 
  title, 
  value, 
  subtitle, 
  linkTo, 
  visual 
}: { 
  title: string;
  value: string;
  subtitle?: string;
  linkTo: string;
  visual?: React.ReactNode;
}) {
  return (
    <Link href={linkTo}>
      <div className="ecc-kpi" data-testid={`kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="ecc-kpi__title">{title}</div>
            <div className="ecc-kpi__value">{value}</div>
            {subtitle && (
              <div className="text-xs text-[var(--text-dim)] mt-1">{subtitle}</div>
            )}
          </div>
          {visual && (
            <div className="ml-3">
              {visual}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function KpiTicker({ kpis }: KpiTickerProps) {
  // Daily receipts trend - would come from live daily collections data
  const collectionsSparkline = [85, 82, 89, 87, 91, 88, kpis.collectionsRatePct];
  
  return (
    <div className="grid grid-cols-4 gap-4" data-testid="kpi-ticker">
      {/* Occupancy with donut chart */}
      <KpiCard
        title="Occupancy"
        value={fmtPct(kpis.occupancyPct)}
        subtitle="vs last month"
        linkTo="/portfolio/units?status=occupied"
        visual={<DonutChart percentage={kpis.occupancyPct} />}
      />
      
      {/* Rent Ready / Vacant */}
      <KpiCard
        title="Rent Ready"
        value={`${kpis.rentReadyVacant.ready}`}
        subtitle={`of ${kpis.rentReadyVacant.vacant} vacant`}
        linkTo="/portfolio/units?status=vacant&rent_ready=true"
      />
      
      {/* Collections MTD with sparkline */}
      <KpiCard
        title="Collections MTD"
        value={fmtPct(kpis.collectionsRatePct)}
        subtitle="daily receipts"
        linkTo="/accounting?range=mtd&type=rent"
        visual={<Sparkline data={collectionsSparkline} />}
      />
      
      {/* Critical Work Orders */}
      <KpiCard
        title="Critical WOs"
        value={String(kpis.openCriticalWO)}
        subtitle="open priority items"
        linkTo="/maintenance?priority=high,critical&status=open"
      />
    </div>
  );
}
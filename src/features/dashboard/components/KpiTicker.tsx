// KPI Ticker - 4 actionable cards with token colors

import { Link } from 'wouter';
import { fmtPct } from '@/utils/format';
import type { DashboardData } from '../hooks/useDashboardData';

interface KpiTickerProps {
  kpis: DashboardData['kpis'];
}

// Donut chart component
function DonutChart({ percentage }: { percentage: number }) {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" className="transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="var(--line)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="var(--altus-gold)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-[var(--text)]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// Sparkline component
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
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="var(--altus-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// KPI Card component
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="ecc-kpi__title">{title}</div>
            <div className="ecc-kpi__value">{value}</div>
            {subtitle && (
              <div className="text-xs text-[var(--text-dim)] mt-1">{subtitle}</div>
            )}
          </div>
          {visual && (
            <div className="ml-3 flex-shrink-0">
              {visual}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function KpiTicker({ kpis }: KpiTickerProps) {
  // Daily receipts sparkline data (simplified)
  const collectionsSparkline = [88, 85, 92, 89, 91, 87, kpis.collectionsRatePct];
  
  return (
    <div className="kpi-grid" data-testid="kpi-ticker">
      {/* Occupancy with donut chart */}
      <KpiCard
        title="Occupancy"
        value={fmtPct(kpis.occupancyPct / 100)}
        subtitle="vs last month"
        linkTo="/portfolio/properties?city=ALL&vacant=1"
        visual={<DonutChart percentage={kpis.occupancyPct} />}
      />
      
      {/* Rent Ready / Vacant */}
      <KpiCard
        title="Rent Ready"
        value={`${kpis.rentReadyVacant.ready}`}
        subtitle={`of ${kpis.rentReadyVacant.vacant} vacant`}
        linkTo="/portfolio/units?status=vacant&rent_ready=1"
      />
      
      {/* Collections MTD with sparkline */}
      <KpiCard
        title="Collections MTD"
        value={fmtPct(kpis.collectionsRatePct / 100)}
        subtitle="daily receipts"
        linkTo="/accounting?scope=MTD"
        visual={<Sparkline data={collectionsSparkline} />}
      />
      
      {/* Critical Work Orders */}
      <KpiCard
        title="Critical WOs"
        value={String(kpis.openCriticalWO)}
        subtitle="open priority items"
        linkTo="/maintenance?priority=high,critical"
      />
    </div>
  );
}
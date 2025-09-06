// KpiTicker.tsx - Genesis v2 specification actionable KPIs with visuals
import React from 'react';
import { Link } from 'wouter';
import { fmtPct, fmtMoney } from '../../../utils/format';

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

// Mini donut chart for percentages (thicker for better visibility)
function MiniDonut({ percentage, size = 40 }: { percentage: number; size?: number }) {
  const circumference = 2 * Math.PI * 12; // Thicker ring
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return (
    <div className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={12}
          stroke="var(--line)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={12}
          stroke="var(--good)"
          strokeWidth="4"
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

// Simple sparkline for daily trends
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

export function KpiTicker({ kpis }: KpiTickerProps) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ecc-kpi">
            <div className="skeleton h-4 w-20 mb-2 rounded"></div>
            <div className="skeleton h-8 w-16 mb-2 rounded"></div>
            <div className="skeleton h-3 w-24 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Portfolio Occupancy - Clickable to units overview */}
      <Link to="/portfolio/units" className="block">
        <button className="ecc-kpi w-full text-left" data-testid="button-kpi-occupancy">
          <div className="ecc-kpi__title">Portfolio Occupancy</div>
          <div className="flex items-center justify-between">
            <div className="ecc-kpi__value">{fmtPct(kpis.occupancyPct, 1)}</div>
            <MiniDonut percentage={kpis.occupancyPct} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <MiniSparkline trend={2} />
            <span className="text-xs text-[var(--good)]">+2.1% vs last month</span>
          </div>
        </button>
      </Link>

      {/* Rent Ready / Vacant - Clickable to vacant units filter */}
      <Link to="/portfolio/units?status=vacant&rent_ready=true" className="block">
        <button className="ecc-kpi w-full text-left" data-testid="button-kpi-vacant">
          <div className="ecc-kpi__title">Rent Ready / Vacant</div>
          <div className="ecc-kpi__value mb-2">
            {kpis.rentReadyVacant.ready} / {kpis.rentReadyVacant.vacant}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--warn)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--altus-black)]">
                {kpis.rentReadyVacant.vacant}
              </span>
            </div>
            <span className="text-xs text-[var(--text-dim)]">units available</span>
          </div>
        </button>
      </Link>

      {/* Collections Rate MTD - Clickable to delinquent tenants */}
      <Link to="/portfolio/tenants?filter=delinquent" className="block">
        <button className="ecc-kpi w-full text-left" data-testid="button-kpi-collections">
          <div className="ecc-kpi__title">Collections (MTD)</div>
          <div className="flex items-center justify-between">
            <div className="ecc-kpi__value">{fmtPct(kpis.collectionsRatePct, 1)}</div>
            <MiniDonut percentage={kpis.collectionsRatePct} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <MiniSparkline trend={-1} />
            <span className="text-xs text-[var(--warn)]\">Daily receipts trend</span>
          </div>
        </button>
      </Link>

      {/* Critical Work Orders - Clickable to maintenance */}
      <Link to="/maintenance?priority=high,critical&status=open" className="block">
        <button className="ecc-kpi w-full text-left" data-testid="button-kpi-workorders">
          <div className="ecc-kpi__title">Critical Work Orders</div>
          <div className="ecc-kpi__value mb-2">{kpis.openCriticalWO}</div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              kpis.openCriticalWO > 5 ? 'bg-[var(--bad)]' : 'bg-[var(--neutral)]'
            }`}>
              <span className="text-xs font-bold text-white">!</span>
            </div>
            <span className="text-xs text-[var(--text-dim)]">
              {kpis.openCriticalWO > 5 ? 'Needs attention' : 'Under control'}
            </span>
          </div>
        </button>
      </Link>
    </div>
  );
}
// src/features/dashboard/components/KpiBanner.tsx
import React from 'react';
import { Link } from 'wouter';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendIndicator } from './TrendIndicator';

interface KpiCardProps {
  title: string;
  value: string;
  trend?: number;
  sparklineData?: number[];
  linkTo: string;
  'data-testid'?: string;
}

function KpiCard({ title, value, trend, sparklineData, linkTo, 'data-testid': testId }: KpiCardProps) {
  const sparkData = sparklineData?.map((v, i) => ({ value: v, index: i })) || [];

  return (
    <Link href={linkTo}>
      <div className="kpi-card dash-card" data-testid={testId}>
        <div className="flex flex-col gap-1">
          <div className="dash-subtle text-sm font-medium uppercase tracking-wide">
            {title}
          </div>
          <div className="text-2xl font-bold text-[var(--altus-text)]">
            {value}
          </div>
          {trend !== undefined && (
            <div className="text-sm">
              <TrendIndicator value={trend} />
            </div>
          )}
        </div>
        
        {sparkData.length > 0 && (
          <div className="sparkline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--altus-gold)"
                  fill="var(--altus-gold)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Link>
  );
}

interface KpiBannerProps {
  data: {
    occupancyPct: number;
    avgTurnDays: number;
    collectionRatePct: number;
    highPriorityWorkOrders: number;
    noiMTD: number; // in cents
  };
  series?: {
    months: Array<{ occupancyPct: number }>;
  };
}

export function KpiBanner({ data, series }: KpiBannerProps) {
  // Generate sparkline data for occupancy
  const occupancySparkline = series?.months?.map(m => m.occupancyPct) || [];
  
  // Mock trend data for demo
  const trends = {
    occupancy: 2.3,
    turnTime: -1.8,
    collection: 1.1,
    workOrders: 0,
    noi: 4.7,
  };

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <div className="kpi-banner">
      <KpiCard
        title="Portfolio Occupancy"
        value={`${data.occupancyPct.toFixed(1)}%`}
        trend={trends.occupancy}
        sparklineData={occupancySparkline}
        linkTo="/portfolio/units?status=vacant"
        data-testid="kpi-occupancy"
      />
      
      <KpiCard
        title="Avg Turn Time"
        value={`${data.avgTurnDays} days`}
        trend={trends.turnTime}
        linkTo="/reports/turns"
        data-testid="kpi-turn-time"
      />
      
      <KpiCard
        title="Rent Collection Rate"
        value={`${data.collectionRatePct.toFixed(1)}%`}
        trend={trends.collection}
        linkTo="/portfolio/tenants?type=delinquent"
        data-testid="kpi-collection-rate"
      />
      
      <KpiCard
        title="High Priority WOs"
        value={data.highPriorityWorkOrders.toString()}
        trend={trends.workOrders}
        linkTo="/construction?priority=high"
        data-testid="kpi-work-orders"
      />
      
      <KpiCard
        title="NOI (MTD)"
        value={formatCurrency(data.noiMTD)}
        trend={trends.noi}
        linkTo="/reports/pnl?period=mtd"
        data-testid="kpi-noi"
      />
    </div>
  );
}
// Genesis Grade KPI Ticker - Portfolio Health Dashboard

import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { KpiCard } from './KpiCard';
import { fmtPct } from '../../../utils/format';

export function KpiTicker() {
  const { kpiData, isLoading, occupancyChartData, collectionsSparklineData } = useDashboardData();

  return (
    <div className="kpi-ticker">
      <KpiCard
        title="Occupancy"
        value={fmtPct(kpiData.occupancy)}
        isLoading={isLoading}
        chartType="donut"
        chartData={occupancyChartData}
      />
      
      <KpiCard
        title="Rent Ready"
        value={`${kpiData.rentReady.ready} of ${kpiData.rentReady.vacant}`}
        metric="vacant units"
        isLoading={isLoading}
      />
      
      <KpiCard
        title="Collections MTD"
        value={fmtPct(kpiData.collections)}
        isLoading={isLoading}
        chartType="sparkline"
        chartData={collectionsSparklineData}
      />
      
      <KpiCard
        title="Critical WOs"
        value={kpiData.criticalWOs.toString()}
        metric="open"
        isLoading={isLoading}
      />
    </div>
  );
}
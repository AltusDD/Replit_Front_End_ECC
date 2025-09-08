// Genesis Grade Dashboard Page - The Definitive SFR Command Center

import React from 'react';
import { KpiTicker } from '../components/KpiTicker';
import { PortfolioGoogleMap } from '../components/PortfolioGoogleMap';
import { PriorityActionFeed } from '../components/PriorityActionFeed';
import { FinancialsAndLeasing } from '../components/FinancialsAndLeasing';
import { OccupancyByCity } from '../components/OccupancyByCity';
import { useDashboardData } from '../hooks/useDashboardData';
import '../../../styles/Dashboard.css';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="skeleton h-24 w-full mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 skeleton h-96"></div>
          <div className="skeleton h-96"></div>
        </div>
        <div className="skeleton h-64 w-full mb-6"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-page">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
            Unable to load dashboard data
          </h2>
          <p className="text-[var(--text-dim)]">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* KPI Ticker - Full Width */}
      <div className="kpi-ticker-container">
        <KpiTicker />
      </div>

      {/* Main Grid - Map (2/3) + Feed (1/3) */}
      <div className="main-grid">
        <div className="map-container panel">
          <PortfolioGoogleMap />
        </div>
        <div className="feed-container panel">
          <PriorityActionFeed />
        </div>
      </div>

      {/* Financials and Leasing Components */}
      <FinancialsAndLeasing 
        cashflow90={data.cashflow90}
        leasingFunnel30={data.leasingFunnel30}
      />

      {/* Occupancy by City - Full Width */}
      <OccupancyByCity occupancyData={data.occupancy30.byCity} />
    </div>
  );
}
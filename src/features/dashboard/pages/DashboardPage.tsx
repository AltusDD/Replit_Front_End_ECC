// Genesis Grade Dashboard Page - The Definitive SFR Command Center

import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { KpiTicker } from '../components/KpiTicker';
import { PortfolioGoogleMap } from '../components/PortfolioGoogleMap';
import { PriorityActionFeed } from '../components/PriorityActionFeed';
import { FinancialsAndLeasing } from '../components/FinancialsAndLeasing';
import '../../../styles/Dashboard.css';

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="dashboard-layout">
      {/* KPI Ticker Skeleton */}
      <div className="kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="ecc-panel p-4">
            <div className="skeleton h-4 w-24 mb-3"></div>
            <div className="skeleton h-8 w-16 mb-2"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
        ))}
      </div>

      {/* Map + Action Feed Skeleton */}
      <div className="main-grid">
        <div className="ecc-panel p-6">
          <div className="skeleton h-6 w-32 mb-4"></div>
          <div className="skeleton h-[520px] w-full rounded-lg"></div>
        </div>
        <div className="ecc-panel p-6">
          <div className="skeleton h-6 w-28 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Financials Skeleton */}
      <div className="financial-grid">
        {[1, 2].map((i) => (
          <div key={i} className="ecc-panel p-6">
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="skeleton h-[280px] w-full rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error State Component
function DashboardError({ error }: { error: Error }) {
  return (
    <div className="dashboard-layout">
      <div className="ecc-panel p-8 col-span-full">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
            Dashboard Unavailable
          </h2>
          <p className="text-sm text-[var(--text-dim)] mb-6 max-w-md mx-auto">
            Unable to load dashboard data. Please check your API connections and try again.
          </p>
          <div className="text-xs text-[var(--bad)] bg-[var(--panel-elev)] border border-[var(--line)] rounded-lg p-3 font-mono max-w-lg mx-auto mb-6">
            {error.message}
          </div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="action-btn action-btn--primary px-6 py-3"
            >
              Retry Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/system/health'}
              className="action-btn action-btn--secondary px-6 py-3"
            >
              System Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  // Error state
  if (error) {
    return <DashboardError error={error} />;
  }

  // Loading state
  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-layout" data-testid="genesis-dashboard">
      {/* Row 1: Portfolio Health Ticker (Full Width) */}
      <div className="kpi-grid">
        <KpiTicker kpis={data.kpis} />
      </div>

      {/* Row 2: Portfolio Operations Map (2/3) + Priority Action Feed (1/3) */}
      <div className="main-grid">
        <PortfolioGoogleMap propertiesForMap={data.propertiesForMap} />
        <PriorityActionFeed actionFeed={data.actionFeed} />
      </div>

      {/* Row 3: Key Financials & Leasing Funnel (Full Width Split) */}
      <div className="financial-grid">
        <FinancialsAndLeasing 
          cashflow90={data.cashflow90} 
          leasingFunnel30={data.leasingFunnel30} 
        />
      </div>
    </div>
  );
}
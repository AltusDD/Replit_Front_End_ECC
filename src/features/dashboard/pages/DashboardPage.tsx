// DashboardPage.tsx - Genesis specification responsive layout with Google Maps centerpiece
import React, { useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { KpiTicker } from '../components/KpiTicker';
import { PortfolioGoogleMap } from '../components/PortfolioGoogleMap';
import { PriorityActionFeed } from '../components/PriorityActionFeed';
import { FinancialsAndLeasing } from '../components/FinancialsAndLeasing';
import { OccupancyBreakdown } from '../components/OccupancyBreakdown';
import '../../../styles/Dashboard.css';

// Loading skeleton components
function KpiTickerSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="ecc-panel p-4">
          <div className="skeleton h-4 w-20 mb-2 rounded"></div>
          <div className="skeleton h-8 w-16 mb-2 rounded"></div>
          <div className="skeleton h-3 w-24 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="h-[500px] bg-[var(--panel-bg)] rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="skeleton h-8 w-8 rounded-full mx-auto mb-4"></div>
        <div className="skeleton h-4 w-32 rounded"></div>
      </div>
    </div>
  );
}

function ActionFeedSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="skeleton h-4 w-32 mb-4 rounded"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, itemIndex) => (
              <div key={itemIndex} className="bg-[var(--panel-elev)] rounded-lg p-4">
                <div className="skeleton h-4 w-24 mb-2 rounded"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FinancialsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="ecc-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton h-6 w-32 rounded"></div>
            <div className="skeleton h-8 w-20 rounded"></div>
          </div>
          <div className="skeleton h-[300px] rounded"></div>
        </div>
      ))}
    </div>
  );
}

function OccupancySkeleton() {
  return (
    <div className="ecc-panel p-6">
      <div className="skeleton h-6 w-48 mb-4 rounded"></div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[var(--panel-elev)] rounded">
            <div className="skeleton h-4 w-20 rounded"></div>
            <div className="skeleton h-4 w-16 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error, debugInfo } = useDashboardData();

  if (error) {
    return (
      <section className="min-h-screen bg-[var(--altus-black)] p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-400 mb-2 text-4xl">⚠️</div>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-3">
              Dashboard Connection Error
            </h2>
            <p className="text-[var(--text-dim)] text-sm max-w-md mx-auto leading-relaxed">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--altus-black)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
            Genesis Command Center
          </h1>
          <p className="text-[var(--text-dim)]">
            Real-time portfolio analytics and operational insights
          </p>
        </div>

        {/* KPI Ticker (full width) */}
        <div>
          {loading || !data ? (
            <KpiTickerSkeleton />
          ) : (
            <KpiTicker kpis={data.kpis} />
          )}
        </div>

        {/* Main Grid: Google Map (2/3) + Priority Action Feed (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {loading || !data ? (
              <MapSkeleton />
            ) : (
              <PortfolioGoogleMap propertiesForMap={data.propertiesForMap} />
            )}
          </div>
          
          <div className="xl:col-span-1">
            {loading || !data ? (
              <ActionFeedSkeleton />
            ) : (
              <PriorityActionFeed actionFeed={data.actionFeed} />
            )}
          </div>
        </div>

        {/* Financials & Leasing Row (two equal columns) */}
        <div>
          {loading || !data ? (
            <FinancialsSkeleton />
          ) : (
            <FinancialsAndLeasing 
              financialData={{
                incomeVsExpenses90: data.incomeVsExpenses90,
                leasingFunnel30: data.leasingFunnel30
              }} 
            />
          )}
        </div>

        {/* Occupancy by City Table (full width) */}
        <div>
          {loading || !data ? (
            <OccupancySkeleton />
          ) : (
            <OccupancyBreakdown occByCity={data.occByCity} />
          )}
        </div>
      </div>
    </section>
  );
}
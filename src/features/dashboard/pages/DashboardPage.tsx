// DashboardPage.tsx - Genesis specification responsive grid layout
import React, { useEffect } from 'react';
import { useDashboardData, type TimeRange } from '../hooks/useDashboardData';
import { KpiBanner } from '../components/KpiBanner';
import { PortfolioMap } from '../components/PortfolioMap';
import { ActionCenter } from '../components/ActionCenter';
import { FinancialSnapshot } from '../components/FinancialSnapshot';
import { LeasingFunnel } from '../components/LeasingFunnel';
import { OccupancyBreakdown } from '../components/OccupancyBreakdown';
// Debug audit removed - using built-in debug mode
import '../../../styles/Dashboard.css';

// Loading skeleton components
function KpiSkeleton() {
  return (
    <div className="kpi-banner">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="dash-card p-4">
          <div className="skeleton h-4 w-24 mb-2 rounded"></div>
          <div className="skeleton h-8 w-16 mb-2 rounded"></div>
          <div className="skeleton h-3 w-20 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dash-title text-lg">{title}</h3>
        <div className="skeleton h-8 w-24 rounded"></div>
      </div>
      <div className="border-b border-gray-700 mb-4"></div>
      <div className="skeleton h-[300px] rounded"></div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dash-title text-lg">Portfolio Map</h3>
        <div className="skeleton h-8 w-32 rounded"></div>
      </div>
      <div className="border-b border-gray-700 mb-4"></div>
      <div className="skeleton h-[400px] rounded"></div>
    </div>
  );
}

function ActionCenterSkeleton() {
  return (
    <div className="dash-card p-6">
      <h3 className="dash-title text-lg mb-6">Action Center</h3>
      <div className="space-y-6">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="skeleton h-4 w-48 mb-3 rounded"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-1 rounded"></div>
                    <div className="skeleton h-3 w-48 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="skeleton h-8 w-16 rounded"></div>
                    <div className="skeleton h-8 w-16 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error, debugInfo } = useDashboardData();

  // Debug info is now handled directly in the useDashboardData hook

  if (error) {
    return (
      <section className="ecc-page">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-400 mb-2">⚠️</div>
            <h2 className="text-lg font-semibold text-[var(--altus-text)] mb-2">
              Dashboard Error
            </h2>
            <p className="text-[var(--altus-muted)] text-sm">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ecc-page">
      <div className="mb-6">
        <h1 className="ecc-page-title">Empire Command Center</h1>
        <p className="text-[var(--altus-muted)] text-sm">
          Real-time portfolio analytics and operational insights
        </p>
      </div>

      {/* CSS Grid Layout */}
      <div className="space-y-6">
        {/* Row 1: KPI Banner (full width) */}
        <div>
          {loading || !data ? (
            <KpiSkeleton />
          ) : (
            <KpiBanner kpis={data.kpis} />
          )}
        </div>

        {/* Row 2: Portfolio Map (2/3) + Action Center (1/3) */}
        <div className="dashboard-grid">
          <div>
            {loading || !data ? (
              <MapSkeleton />
            ) : (
              <div className="dash-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="dash-title text-lg">Portfolio Map</h3>
                </div>
                <div className="border-b border-gray-700 mb-4"></div>
                <PortfolioMap properties={data.properties} />
              </div>
            )}
          </div>
          
          <div>
            {loading || !data ? (
              <ActionCenterSkeleton />
            ) : (
              <div className="dash-card p-6">
                <h3 className="dash-title text-lg mb-6">Action Center</h3>
                <ActionCenter 
                  leasesExpiring={data.leasesExpiring45}
                  topDelinquents={data.topDelinquents}
                  highPriorityWOs={data.highPriorityWOs}
                />
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Financial Snapshot (full width; two charts inside) */}
        <div className="dash-row">
          {loading || !data ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton title="Income vs Expenses" />
              <ChartSkeleton title="Portfolio Value vs Debt" />
            </div>
          ) : (
            <FinancialSnapshot 
              incomeVsExpenses={data.incomeVsExpenses}
              valueVsDebt={data.valueVsDebt}
            />
          )}
        </div>

        {/* Row 4: Leasing Funnel (1/2) + Occupancy Breakdown (1/2) */}
        <div className="dashboard-grid">
          <div>
            {loading || !data ? (
              <ChartSkeleton title="Leasing Funnel" />
            ) : (
              <LeasingFunnel funnel={data.funnel90} />
            )}
          </div>
          
          <div>
            {loading || !data ? (
              <ChartSkeleton title="Occupancy Breakdown" />
            ) : (
              <OccupancyBreakdown occByCity={data.occByCity} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
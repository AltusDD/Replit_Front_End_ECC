// Canonical dashboard page (single source). If a second dashboard file exists
// (e.g., Dashboard.tsx or MainDashboard.tsx), export *from* this file there.
import React from "react";
import { KpiTicker } from "../components/KpiTicker";
import { PortfolioGoogleMap } from "../components/PortfolioGoogleMap";
import { PriorityActionFeed } from "../components/PriorityActionFeed";
import { FinancialsAndLeasing } from "../components/FinancialsAndLeasing";
import { OccupancyByCity } from "../components/OccupancyByCity";
import { useDashboardData } from "../hooks/useDashboardData";
import "../../../styles/Dashboard.css";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="dashboard-layout">
        <div className="ecc-panel p-6">
          <h3 className="ecc-panel__title">Dashboard Error</h3>
          <p className="text-sm text-[var(--text-dim)]">
            {error.message || "Something went wrong. Please retry."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="dashboard-layout">
        <div className="dashboard-row">
          <div className="skeleton h-[92px] w-full rounded-lg bg-[var(--panel-elev)] animate-pulse" />
        </div>
        <div className="dashboard-row">
          <div className="skeleton h-[520px] w-full rounded-lg bg-[var(--panel-elev)] animate-pulse" />
        </div>
        <div className="dashboard-row">
          <div className="skeleton h-[300px] w-full rounded-lg bg-[var(--panel-elev)] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout" data-testid="dashboard-page">
      {/* Row 1: KPI Ticker (full width) */}
      <div className="dashboard-row">
        <KpiTicker kpis={data.kpis} />
      </div>

      {/* Row 2: Map (2/3) + Action Feed (1/3) */}
      <div className="dashboard-row">
        <div className="main-grid">
          <PortfolioGoogleMap 
            propertiesForMap={data.propertiesForMap || []}
            missingGeoCount={0}
          />
          <PriorityActionFeed actionFeed={data.actionFeed || { delinquentsTop: [], leasesExpiring45: [], workOrdersHotlist: [] }} />
        </div>
      </div>

      {/* Row 3: Cash Flow (1/2) + Leasing Funnel (1/2) */}
      <div className="dashboard-row">
        <FinancialsAndLeasing 
          cashflow90={data.cashflow90 || []}
          leasingFunnel30={data.leasingFunnel30 || { leads: 0, tours: 0, applications: 0, approved: 0, signed: 0 }}
        />
      </div>

      {/* Row 4: Occupancy by City (full width) */}
      <div className="dashboard-row">
        <OccupancyByCity occupancyData={data.occupancy30?.byCity || []} />
      </div>
    </div>
  );
}
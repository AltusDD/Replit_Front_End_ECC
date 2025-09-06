// Dashboard Page - responsive grid with QA overlay

import { useDashboardData } from '../hooks/useDashboardData';
import { KpiTicker } from '../components/KpiTicker';
import { PortfolioGoogleMap } from '../components/PortfolioGoogleMap';
import { PriorityActionFeed } from '../components/PriorityActionFeed';
import { FinancialsAndLeasing } from '../components/FinancialsAndLeasing';
import { OccupancyByCity } from '../components/OccupancyByCity';

// Loading skeleton component
function SkeletonCard({ className = "h-48" }: { className?: string }) {
  return (
    <div className={`ecc-panel p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="skeleton h-4 w-3/4 mb-3"></div>
        <div className="skeleton h-6 w-1/2 mb-4"></div>
        <div className="skeleton h-32 w-full"></div>
      </div>
    </div>
  );
}

// QA overlay component
function QAOverlay({ 
  qa, 
  onClose 
}: { 
  qa: NonNullable<ReturnType<typeof useDashboardData>['qa']>; 
  onClose: () => void;
}) {
  const handleCopyReport = () => {
    const report = JSON.stringify(qa, null, 2);
    navigator.clipboard.writeText(report).then(() => {
      alert('QA report copied to clipboard');
    }).catch(() => {
      alert('Failed to copy report');
    });
  };
  
  return (
    <div className="qa-overlay">
      <div className="qa-overlay__header">
        <div className="flex items-center justify-between">
          QA Debug Overlay
          <button 
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text)] text-xl"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="qa-overlay__section">
        <div className="qa-overlay__section-title">Data Counts</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Properties:</span>
            <span className="text-[var(--text)]">{qa.counts.properties}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Units:</span>
            <span className="text-[var(--text)]">{qa.counts.units}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Leases:</span>
            <span className="text-[var(--text)]">{qa.counts.leases}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Tenants:</span>
            <span className="text-[var(--text)]">{qa.counts.tenants}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Work Orders:</span>
            <span className="text-[var(--text)]">{qa.counts.workorders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Transactions:</span>
            <span className="text-[var(--text)]">{qa.counts.transactions}</span>
          </div>
        </div>
      </div>
      
      <div className="qa-overlay__section">
        <div className="qa-overlay__section-title">Missing Data</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Missing Geo:</span>
            <span className={qa.missing.geo > 0 ? "text-[var(--warn)]" : "text-[var(--good)]"}>
              {qa.missing.geo}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Missing Names:</span>
            <span className={qa.missing.tenantNames > 0 ? "text-[var(--warn)]" : "text-[var(--good)]"}>
              {qa.missing.tenantNames}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-dim)]">Missing Priorities:</span>
            <span className={qa.missing.woPriority > 0 ? "text-[var(--warn)]" : "text-[var(--good)]"}>
              {qa.missing.woPriority}
            </span>
          </div>
        </div>
      </div>
      
      <div className="qa-overlay__section">
        <div className="qa-overlay__section-title">Last Updated</div>
        <div className="text-xs text-[var(--text-dim)]">
          {new Date(qa.lastUpdated).toLocaleString()}
        </div>
      </div>
      
      <div className="qa-overlay__section">
        <div className="qa-overlay__section-title">Full Report</div>
        <div className="qa-overlay__json">
          {JSON.stringify(qa, null, 2)}
        </div>
        <button 
          onClick={handleCopyReport}
          className="qa-overlay__button mt-3 w-full"
        >
          Copy Report to Clipboard
        </button>
      </div>
    </div>
  );
}

// Main dashboard page component
export function DashboardPage() {
  const { data, loading, error, qa } = useDashboardData();
  
  // Check if debug mode is enabled
  const isDebugMode = typeof window !== 'undefined' && 
                      new URLSearchParams(window.location.search).get('debug') === '1';
  
  // Handle QA overlay toggle
  const handleCloseQA = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('debug');
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };
  
  if (error) {
    return (
      <div className="dashboard-layout">
        <div className="text-center py-20">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
            Dashboard Error
          </h2>
          <p className="text-[var(--text-dim)] mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-lg font-medium hover:opacity-90 transition-opacity"
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
        {/* KPI Row Skeleton */}
        <div className="dashboard-row">
          <div className="kpi-grid">
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
          </div>
        </div>
        
        {/* Main Grid Skeleton */}
        <div className="dashboard-row">
          <div className="main-grid">
            <SkeletonCard className="h-96" />
            <SkeletonCard className="h-96" />
          </div>
        </div>
        
        {/* Financial Grid Skeleton */}
        <div className="dashboard-row">
          <div className="financial-grid">
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
          </div>
        </div>
        
        {/* Occupancy Table Skeleton */}
        <div className="dashboard-row">
          <SkeletonCard className="h-96" />
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
            propertiesForMap={data.propertiesForMap}
            missingGeoCount={qa?.missing.geo || 0}
          />
          <PriorityActionFeed actionFeed={data.actionFeed} />
        </div>
      </div>
      
      {/* Row 3: Cash Flow (1/2) + Leasing Funnel (1/2) */}
      <div className="dashboard-row">
        <FinancialsAndLeasing 
          cashflow90={data.cashflow90}
          leasingFunnel30={data.leasingFunnel30}
        />
      </div>
      
      {/* Row 4: Occupancy by City (full width) */}
      <div className="dashboard-row">
        <OccupancyByCity occupancyData={data.occupancy30.byCity} />
      </div>
      
      {/* QA Overlay (debug mode only) */}
      {isDebugMode && qa && (
        <QAOverlay qa={qa} onClose={handleCloseQA} />
      )}
    </div>
  );
}
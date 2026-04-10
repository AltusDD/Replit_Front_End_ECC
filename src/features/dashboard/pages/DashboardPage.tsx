import React from "react";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import { Sparkline } from "@/features/dashboard/components/Sparkline";
import KpiStrip from "@/components/analytics/KpiStrip";
import ActiveFilterSummary from "@/components/analytics/ActiveFilterSummary";
import { buildDashboardFilterSummary, buildDashboardMetricCards } from "@/features/dashboard/dashboardMetricRegistry";

function toPct(n?: number) {
  return Number.isFinite(n!) ? n! * 100 : undefined;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardKpis();
  const series = (data?.series ?? []).map(p => ({ date: p.date, value: toPct(p.occupancy)! }));

  if (isLoading) return <div className="p-6">Loading dashboard…</div>;
  if (isError)   return <div className="p-6">Failed to load dashboard.</div>;
  if (!data) return <div className="p-6">No dashboard data available.</div>;

  const metricCards = buildDashboardMetricCards(data);
  const filterSummary = buildDashboardFilterSummary(data);

  return (
    <div className="dashboard-grid p-6 space-y-6">
      <KpiStrip title="War-Room Metric Rail" items={metricCards} />
      <ActiveFilterSummary title="Active Dashboard Scope" items={filterSummary} />
      <Sparkline data={series} />
    </div>
  );
}

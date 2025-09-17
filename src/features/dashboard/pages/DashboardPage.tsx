import React from "react";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { Sparkline } from "@/features/dashboard/components/Sparkline";
import { DASHBOARD_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";

function toPct(n?: number) {
  return Number.isFinite(n!) ? n! * 100 : undefined;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardKpis();
  const occPct = toPct(data?.occupancyRate);
  const series = (data?.series ?? []).map(p => ({ date: p.date, value: toPct(p.occupancy)! }));

  if (isLoading) return <div className="p-6">Loading dashboard…</div>;
  if (isError)   return <div className="p-6">Failed to load dashboard.</div>;

  return (
    <div className="dashboard-grid p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Properties" value={data?.propertiesTotal} testId={DASHBOARD_KPI_TEST_IDS.PROPERTIES} />
        <KpiCard label="Units" value={data?.unitsTotal} testId={DASHBOARD_KPI_TEST_IDS.UNITS} />
        <KpiCard label="Occupancy" value={occPct} decimals={1} testId={DASHBOARD_KPI_TEST_IDS.OCCUPANCY} />
        <KpiCard label="Revenue (30d)" value={(data?.revenue30dCents ?? 0) / 100} decimals={0} testId={DASHBOARD_KPI_TEST_IDS.REVENUE} />
      </div>
      <Sparkline data={series} />
    </div>
  );
}
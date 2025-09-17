import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="owner-kpis">
      <KPI label="Portfolio Units" value={n(data.kpis?.units)?.toLocaleString()} data-testid="kpi-portfolio-units" />
      <KPI label="Active Leases" value={n(data.kpis?.activeLeases)?.toLocaleString()} data-testid="kpi-active-leases" />
      <KPI label="Occupancy" value={
        typeof data.kpis?.occupancyPct === "number"
          ? `${Math.round(data.kpis.occupancyPct)}%`
          : undefined
      } data-testid="kpi-occupancy" />
      <KPI label="Avg Rent" value={
        typeof data.kpis?.avgRentCents === "number"
          ? `$${Math.round(data.kpis.avgRentCents / 100).toLocaleString()}`
          : undefined
      } data-testid="kpi-avg-rent" />
    </KPIRow>
  );
}
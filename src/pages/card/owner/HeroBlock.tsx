import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(data?.portfolio_units ?? data?.unitCount)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.active_leases ?? data?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={pct(data?.occupancy_pct ?? data?.occupancyPct)} percent />
      <KPI data-testid="kpi-avg-rent" label="Avg. Rent" value={n(((data?.avg_rent_cents ?? data?.avgrent_cents ?? data?.avgRent) as number) / 100)} currency />
    </KPIRow>
  );
}

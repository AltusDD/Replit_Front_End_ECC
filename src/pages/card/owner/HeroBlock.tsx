import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const o = data?.owner ?? data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(o?.portfolio_units ?? o?.unitCount)} />
      <KPI data-testid="kpi-active-leases"   label="Active Leases"    value={n(o?.active_leases ?? o?.activeLeases)} />
      <KPI data-testid="kpi-occupancy"       label="Occupancy"        value={pct(o?.occupancy_pct ?? o?.occupancyPct)} percent />
      <KPI data-testid="kpi-avg-rent"        label="Avg. Rent"        value={n((o?.avg_rent_cents ?? o?.avgRent_cents ?? o?.avgRent) / 100)} currency />
    </KPIRow>
  );
}

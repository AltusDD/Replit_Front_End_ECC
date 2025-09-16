import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <KPIRow data-testid="owner-kpis">
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={formatNumber(data.kpis?.units)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={formatNumber(data.kpis?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={formatPercent(data.kpis?.occupancyPct)} />
      <KPI data-testid="kpi-avg-rent" label="Avg Rent" value={formatCurrencyFromCents(data.kpis?.avgRentCents)} />
    </KPIRow>
  );
}
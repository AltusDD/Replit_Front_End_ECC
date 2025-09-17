import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const owner = data?.owner;

  return (
    <KPIRow data-testid="owner-kpis">
      <KPI label="Portfolio Units" value={<div data-testid="kpi-portfolio-units">{formatNumber(owner?.portfolioUnits || owner?.portfolio_units || owner?.units)}</div>} />
      <KPI label="Active Leases" value={<div data-testid="kpi-active-leases">{formatNumber(owner?.activeLeases || owner?.active_leases)}</div>} />
      <KPI label="Occupancy" value={<div data-testid="kpi-occupancy">{formatPercent(owner?.occupancyRate || owner?.occupancy_rate || owner?.occupancy_pct, { decimals: 1, basis: 'fraction' })}</div>} />
      <KPI label="Avg Rent" value={<div data-testid="kpi-avg-rent">{formatCurrencyFromCents(owner?.avgRentCents || owner?.avg_rent_cents)}</div>} />
    </KPIRow>
  );
}
import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Extract owner data with safe access
  const owner = data.owner;

  return (
    <KPIRow data-testid="owner-kpis">
      <KPI label="Portfolio Units" value={<div data-testid="kpi-portfolio-units">{formatNumber(owner?.portfolioUnits !== null && owner?.portfolioUnits !== undefined ? owner.portfolioUnits : 0, 0)}</div>} />
      <KPI label="Active Leases" value={<div data-testid="kpi-active-leases">{formatNumber(owner?.activeLeases !== null && owner?.activeLeases !== undefined ? owner.activeLeases : 0, 0)}</div>} />
      <KPI label="Occupancy" value={<div data-testid="kpi-occupancy">{formatPercent(owner?.occupancyRate, 1, "fraction")}</div>} />
      <KPI label="Avg Rent" value={<div data-testid="kpi-avg-rent">{formatCurrencyFromCents(owner?.avgRentCents)}</div>} />
    </KPIRow>
  );
}
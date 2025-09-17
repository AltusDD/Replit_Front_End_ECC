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
      <KPI 
        label="Portfolio Units" 
        value={formatNumber(owner?.portfolioUnits !== null && owner?.portfolioUnits !== undefined ? owner.portfolioUnits : 0, 0)}
        data-testid="kpi-portfolio-units"
      />
      <KPI 
        label="Active Leases" 
        value={formatNumber(owner?.activeLeases !== null && owner?.activeLeases !== undefined ? owner.activeLeases : 0, 0)}
        data-testid="kpi-active-leases"
      />
      <KPI 
        label="Occupancy" 
        value={formatPercent(owner?.occupancyRate, 1, "fraction")}
        data-testid="kpi-occupancy"
      />
      <KPI 
        label="Avg Rent" 
        value={formatCurrencyFromCents(owner?.avgRentCents)}
        data-testid="kpi-avg-rent"
      />
    </KPIRow>
  );
}
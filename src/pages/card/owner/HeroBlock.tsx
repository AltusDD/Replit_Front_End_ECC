import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <div className="ecc-object">
      <KPIRow data-testid="owner-kpis">
        <KPI
          data-testid="hero.owner.kpi.unitsTotal"
          label="Portfolio Units"
          value={formatNumber(data.kpis?.units)}
        />
        <KPI
          data-testid="hero.owner.kpi.activeLeases"
          label="Active Leases"
          value={formatNumber(data.kpis?.activeLeases)}
        />
        <KPI
          data-testid="hero.owner.kpi.occupancy"
          label="Occupancy"
          value={formatPercent(data.kpis?.occupancyPct, { basis: 'percent', decimals: 0 })}
        />
        <KPI
          data-testid="hero.owner.kpi.avgRent"
          label="Avg Rent"
          value={formatCurrencyFromCents(data.kpis?.avgRentCents)}
        />
      </KPIRow>
    </div>
  );
}
import { KPIRow } from "@/components/cardkit/KPIRow";
import { KPI } from "@/components/cardkit/KPI";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <div className="ecc-object">
      <KPIRow data-testid="property-kpis">
        <KPI
          data-testid="hero.property.kpi.unitsTotal"
          label="Units"
          value={formatNumber(data.kpis?.units)}
        />
        <KPI
          data-testid="hero.property.kpi.activeLeases"
          label="Active Leases"
          value={formatNumber(data.kpis?.activeLeases)}
        />
        <KPI
          data-testid="hero.property.kpi.occupancy"
          label="Occupancy"
          value={formatPercent(data.kpis?.occupancyPct, { basis: 'percent', decimals: 0 })}
        />
        <KPI
          data-testid="hero.property.kpi.avgRent"
          label="Avg Rent"
          value={formatCurrencyFromCents(data.kpis?.avgRentCents)}
        />
      </KPIRow>
      <span data-testid="address" style={{ display: "none" }} />
    </div>
  );
}
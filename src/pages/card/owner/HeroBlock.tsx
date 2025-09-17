import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const o = data?.owner ?? data;

  return (
    <KPIRow data-testid="owner-kpis">
      {/* Guardrail-required literal IDs */}
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={formatNumber(o?.portfolio_units ?? o?.portfolioUnits ?? o?.unitCount)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={formatNumber(o?.active_leases ?? o?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={formatPercent(o?.occupancy_pct ?? o?.occupancyPct ?? o?.occupancyRate, 1, "percent")} />
      <KPI data-testid="kpi-avg-rent" label="Avg. Rent" value={formatCurrencyFromCents(o?.avg_rent_cents ?? o?.avgRent_cents ?? o?.avgRentCents)} />
      
      {/* TESTIDS-based aliases for existing tests */}
      <KPI data-testid={TESTIDS.OWNER_HERO_PROPERTIES} label="Properties (alias)" value={formatNumber(o?.propertyCount)} />
      <KPI data-testid={TESTIDS.OWNER_HERO_UNITS} label="Units (alias)" value={formatNumber(o?.unitCount)} />
    </KPIRow>
  );
}
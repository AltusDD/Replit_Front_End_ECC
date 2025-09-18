import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatCurrencyFromCents, formatPercent } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const toFraction = (v?: number | null) => {
    if (typeof v !== "number" || !isFinite(v)) return undefined;
    return v > 1 ? v / 100 : v; // accepts 0..1 or 0..100
  };

  const o = data?.owner ?? data;

  const avgRentCents = o?.avg_rent_cents ?? o?.avgRent_cents ?? (o?.avgRent ? o.avgRent * 100 : undefined);
  const units = typeof (o?.portfolio_units ?? o?.unitCount) === "number" ? (o?.portfolio_units ?? o?.unitCount) : undefined;
  const occ = toFraction(o?.occupancy_pct ?? o?.occupancyPct);

  const vacancyCostCents = (() => {
    if (avgRentCents === undefined || units === undefined || occ === undefined) return undefined;
    const val = (1 - occ) * units * avgRentCents;
    return isFinite(val) ? val : undefined;
  })();

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(o?.portfolio_units ?? o?.unitCount)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(o?.active_leases ?? o?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={formatPercent(o?.occupancy_pct ?? o?.occupancyPct)} />
      <KPI data-testid="kpi-avg-rent" label="Avg. Rent" value={formatCurrencyFromCents(avgRentCents)} />
      {/* NEW: estimated monthly cost of vacant units */}
      <KPI data-testid="kpi-vacancy-cost" label="Vacancy Cost (est)" value={formatCurrencyFromCents(vacancyCostCents)} />
    </KPIRow>
  );
}

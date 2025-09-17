import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      {/* Guardrail-required IDs */}
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(data?.unitCount)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={pct(data?.occupancyPct)} percent />
      <KPI data-testid="kpi-avg-rent" label="Avg. Rent" value={n(data?.avgRent)} currency />

      {/* Central-test aliases (keep for existing unit/e2e tests) */}
      <KPI data-testid={TESTIDS.OWNER_HERO_PROPERTIES} label="Properties (alias)" value={n(data?.propertyCount)} />
      <KPI data-testid={TESTIDS.OWNER_HERO_UNITS} label="Units (alias)" value={n(data?.unitCount)} />
      <KPI label="Status" value={safe<string>(data?.status, "—")} />
    </KPIRow>
  );
}
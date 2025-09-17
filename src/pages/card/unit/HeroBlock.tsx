import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const unit = data?.unit ?? data;
  const bedbath =
    typeof unit?.beds === "number" && typeof unit?.baths === "number"
      ? `${unit.beds}bd/${unit.baths}ba`
      : BLANK;

  return (
    <KPIRow>
      {/* Guardrail-required literal IDs */}
      <KPI data-testid="kpi-lease-status" label="Lease Status" value={safe(unit?.lease_status ?? unit?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Rent" value={n((unit?.market_rent_cents ?? unit?.rent_cents ?? unit?.rent) / 100)} currency />
      <KPI data-testid="kpi-bedbath" label="Beds/Baths" value={bedbath} />
      <KPI data-testid="kpi-sqft" label="Sq Ft" value={n(unit?.sq_ft ?? unit?.sqft)} />
      {/* Central IDs (aliases) */}
      <KPI data-testid={TESTIDS.UNIT_HERO_MARKET_RENT} label="Market Rent (alias)" value={n((unit?.market_rent_cents ?? unit?.rent_cents ?? unit?.rent) / 100)} currency />
      <KPI data-testid={TESTIDS.UNIT_HERO_BEDS_BATHS} label="Beds/Baths (alias)" value={bedbath} />
    </KPIRow>
  );
}

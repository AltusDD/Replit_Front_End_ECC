import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPI";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Access unit data from the nested structure expected by the test  
  const unit = data?.unit || data;

  return (
    <KPIRow>
      <KPI data-testid={HERO_KPI_TEST_IDS.UNIT_LEASE_STATUS} label="Status" value={safe<string>(unit?.lease_status, "—")} />
      <KPI data-testid={HERO_KPI_TEST_IDS.UNIT_RENT} label="Market Rent" value={unit?.market_rent_cents ? `$${(unit.market_rent_cents / 100).toLocaleString()}` : "—"} />
      <KPI data-testid={HERO_KPI_TEST_IDS.UNIT_BEDBATH} label="Beds/Baths" value={unit?.beds && unit?.baths ? `${unit.beds} / ${unit.baths}` : BLANK} />
      <KPI data-testid={HERO_KPI_TEST_IDS.UNIT_SQFT} label="Sq Ft" value={n(unit?.sq_ft)} />
    </KPIRow>
  );
}

import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI
        data-testid={TESTIDS.UNIT_HERO_MARKET_RENT}
        label="Market Rent"
        value={n(data?.marketRent)}
        currency
      />
      <KPI
        data-testid={TESTIDS.UNIT_HERO_BEDS_BATHS}
        label="Beds/Baths"
        value={safe<string>(data?.bedsBaths, BLANK)}
      />
      <KPI label="Sq Ft" value={n(data?.sqft)} />
      <KPI label="Status" value={safe<string>(data?.status, "—")} />
    </KPIRow>
  );
}

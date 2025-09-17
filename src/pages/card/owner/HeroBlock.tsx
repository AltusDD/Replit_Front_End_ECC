import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid={TESTIDS.OWNER_HERO_PROPERTIES} label="Properties" value={n(data?.propertyCount)} />
      <KPI data-testid={TESTIDS.OWNER_HERO_UNITS} label="Units" value={n(data?.unitCount)} />
      <KPI label="AUM" value={n(data?.aum)} currency />
      <KPI label="Status" value={safe<string>(data?.status, "—")} />
    </KPIRow>
  );
}

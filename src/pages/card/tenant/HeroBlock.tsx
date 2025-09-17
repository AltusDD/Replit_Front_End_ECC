import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid={TESTIDS.TENANT_HERO_BALANCE} label="Balance" value={n(data?.balance)} currency />
      <KPI data-testid={TESTIDS.TENANT_HERO_STATUS} label="Status" value={safe<string>(data?.status, "—")} />
      <KPI label="Since" value={safe<string>(data?.since, BLANK)} />
      <KPI label="Phone" value={safe<string>(data?.phone, BLANK)} />
    </KPIRow>
  );
}

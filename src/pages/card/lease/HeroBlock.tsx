import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPI";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Access lease data from the nested structure expected by the test
  const lease = data?.lease || data;

  return (
    <KPIRow>
      <KPI data-testid={HERO_KPI_TEST_IDS.LEASE_STATUS} label="Status" value={safe<string>(lease?.status, "—")} />
      <KPI data-testid={HERO_KPI_TEST_IDS.LEASE_RENT} label="Rent" value={lease?.rent_cents ? `$${(lease.rent_cents / 100).toLocaleString()}` : "—"} />
      <KPI data-testid={HERO_KPI_TEST_IDS.LEASE_TERM} label="Term" value={safe<string>(lease?.term, BLANK)} />
      <KPI data-testid={HERO_KPI_TEST_IDS.LEASE_BALANCE} label="Balance" value={lease?.balance_cents ? `$${(lease.balance_cents / 100).toLocaleString()}` : "—"} />
    </KPIRow>
  );
}

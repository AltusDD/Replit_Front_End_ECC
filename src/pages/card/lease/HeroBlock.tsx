import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const lease = data?.lease ?? data;

  return (
    <KPIRow>
      {/* Guardrail-required literal IDs */}
      <KPI data-testid="kpi-lease-status" label="Lease Status" value={safe(lease?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Monthly Rent" value={n((lease?.rent_cents ?? lease?.rent) / 100)} currency />
      <KPI data-testid="kpi-term" label="Term" value={safe(lease?.term ?? lease?.expiration, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={n((lease?.balance_cents ?? lease?.balance) / 100)} currency />
      {/* Central IDs kept for our tests */}
      <KPI data-testid={TESTIDS.LEASE_HERO_RENT} label="Rent (alias)" value={n((lease?.rent_cents ?? lease?.rent) / 100)} currency />
      <KPI data-testid={TESTIDS.LEASE_HERO_BALANCE} label="Balance (alias)" value={n((lease?.balance_cents ?? lease?.balance) / 100)} currency />
      <KPI data-testid={TESTIDS.LEASE_HERO_STATUS} label="Status (alias)" value={safe(lease?.status, "—")} />
      <KPI data-testid={TESTIDS.LEASE_HERO_EXPIRATION} label="Expiration (alias)" value={safe(lease?.expiration, BLANK)} />
    </KPIRow>
  );
}

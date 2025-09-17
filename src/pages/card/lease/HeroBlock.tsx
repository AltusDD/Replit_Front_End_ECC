import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      {/* Guardrail-required IDs */}
      <KPI data-testid="kpi-lease-status" label="Lease Status" value={safe<string>(data?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Monthly Rent" value={n(data?.rent)} currency />
      <KPI data-testid="kpi-term" label="Term" value={safe<string>(data?.term ?? data?.expiration, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={n(data?.balance)} currency />

      {/* Central-test aliases (keep for existing unit/e2e tests) */}
      <KPI data-testid={TESTIDS.LEASE_HERO_RENT} label="Rent (alias)" value={n(data?.rent)} currency />
      <KPI data-testid={TESTIDS.LEASE_HERO_BALANCE} label="Balance (alias)" value={n(data?.balance)} currency />
      <KPI data-testid={TESTIDS.LEASE_HERO_STATUS} label="Status (alias)" value={safe<string>(data?.status, "—")} />
      <KPI
        data-testid={TESTIDS.LEASE_HERO_EXPIRATION}
        label="Expiration (alias)"
        value={safe<string>(data?.expiration, BLANK)}
      />
    </KPIRow>
  );
}
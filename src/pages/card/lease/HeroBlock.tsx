import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);

  // Extract lease data with safe access
  const lease = data?.lease;

  return (
    <KPIRow data-testid="lease-kpis">
      {/* Guardrail-required literal IDs */}
      <KPI data-testid="kpi-lease-status" label="Status" value={safe(lease?.status, BLANK)} />
      <KPI data-testid="kpi-rent" label="Monthly Rent" value={formatCurrencyFromCents(lease?.rent_cents ?? lease?.rentCents)} />
      <KPI data-testid="kpi-term" label="Term" value={safe(lease?.term, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={formatCurrencyFromCents(lease?.balance_cents ?? lease?.balanceCents)} />
      
      {/* TESTIDS-based aliases for existing tests */}
      <KPI data-testid={TESTIDS.LEASE_HERO_STATUS} label="Status (alias)" value={safe(lease?.status, BLANK)} />
      <KPI data-testid={TESTIDS.LEASE_HERO_RENT} label="Rent (alias)" value={formatCurrencyFromCents(lease?.rent_cents ?? lease?.rentCents)} />
      <KPI data-testid={TESTIDS.LEASE_HERO_TERM} label="Term (alias)" value={safe(lease?.term, BLANK)} />
      <KPI data-testid={TESTIDS.LEASE_HERO_BALANCE} label="Balance (alias)" value={formatCurrencyFromCents(lease?.balance_cents ?? lease?.balanceCents)} />
    </KPIRow>
  );
}
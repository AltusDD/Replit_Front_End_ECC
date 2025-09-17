import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const t = data?.tenant ?? data;

  return (
    <KPIRow data-testid="tenant-kpis">
      {/* Guardrail-required literal IDs */}
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={formatNumber(t?.active_leases ?? t?.activeLeases)} />
      <KPI data-testid="kpi-current-balance" label="Current Balance" value={formatCurrencyFromCents(t?.current_balance_cents ?? t?.balance_cents ?? t?.currentBalanceCents)} />
      <KPI data-testid="kpi-on-time-rate" label="On-Time Rate" value={formatPercent(t?.on_time_rate ?? t?.onTimeRate, 1, "percent")} />
      <KPI data-testid="kpi-open-workorders" label="Open Workorders" value={formatNumber(t?.open_workorders ?? t?.openWorkorders ?? t?.openWorkOrders)} />
      
      {/* TESTIDS-based aliases for existing tests */}
      <KPI data-testid={TESTIDS.TENANT_HERO_BALANCE} label="Balance (alias)" value={formatCurrencyFromCents(t?.current_balance_cents ?? t?.balance_cents ?? t?.currentBalanceCents)} />
      <KPI data-testid={TESTIDS.TENANT_HERO_STATUS} label="Status (alias)" value={safe(t?.status, "—")} />
    </KPIRow>
  );
}
import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK, formatCurrencyFromCents, formatPercent } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const t = data?.tenant ?? data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(t?.active_leases ?? t?.activeLeases)} />
      <KPI data-testid="kpi-current-balance" label="Current Balance" value={formatCurrencyFromCents(t?.current_balance_cents ?? t?.balance_cents ?? t?.balance)} />
      <KPI data-testid="kpi-on-time-rate" label="On-Time Rate" value={formatPercent(t?.on_time_rate ?? t?.onTimeRate)} />
      <KPI data-testid="kpi-open-workorders" label="Open Workorders" value={n(t?.open_workorders ?? t?.openWorkorders)} />
      {/* NEW: mirrors on-time rate as a user-friendly "Payment Health" */}
      <KPI data-testid="kpi-payment-health" label="Payment Health" value={formatPercent(t?.on_time_rate ?? t?.onTimeRate)} />
    </KPIRow>
  );
}

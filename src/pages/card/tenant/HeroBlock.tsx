import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const t = data?.tenant ?? data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases"    label="Active Leases"    value={n(t?.active_leases ?? t?.activeLeases)} />
      <KPI data-testid="kpi-current-balance"  label="Current Balance"  value={n((t?.current_balance_cents ?? t?.balance_cents ?? t?.balance) / 100)} currency />
      <KPI data-testid="kpi-on-time-rate"     label="On-Time Rate"     value={pct(t?.on_time_rate ?? t?.onTimeRate)} percent />
      <KPI data-testid="kpi-open-workorders"  label="Open Workorders"  value={n(t?.open_workorders ?? t?.openWorkorders)} />
    </KPIRow>
  );
}

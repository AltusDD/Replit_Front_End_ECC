import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.active_leases ?? data?.activeLeases)} />
      <KPI data-testid="kpi-current-balance" label="Current Balance" value={n(data?.current_balance ?? data?.balance)} currency />
      <KPI data-testid="kpi-on-time-rate" label="On-Time Rate" value={pct(data?.on_time_rate_pct ?? data?.onTimeRate)} percent />
      <KPI data-testid="kpi-open-workorders" label="Open Work Orders" value={n(data?.open_workorders ?? data?.openWorkOrders)} />
    </KPIRow>
  );
}

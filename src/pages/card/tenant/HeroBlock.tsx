import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const tenant = data?.tenant;

  return (
    <KPIRow data-testid="tenant-kpis">
      <KPI label="Active Leases" value={<div data-testid="kpi-active-leases">{formatNumber(tenant?.activeLeases || tenant?.active_leases)}</div>} />
      <KPI label="Current Balance" value={<div data-testid="kpi-current-balance">{formatCurrencyFromCents(tenant?.currentBalanceCents || tenant?.current_balance_cents)}</div>} />
      <KPI label="On-Time Rate" value={<div data-testid="kpi-on-time-rate">{formatPercent(tenant?.onTimeRate || tenant?.on_time_rate, { decimals: 1, basis: 'fraction' })}</div>} />
      <KPI label="Open Work Orders" value={<div data-testid="kpi-open-workorders">{formatNumber(tenant?.openWorkOrders || tenant?.open_work_orders)}</div>} />
    </KPIRow>
  );
}
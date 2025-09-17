import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const leases = data.leases ?? [];

  // Extract tenant data with safe access
  const tenant = data.tenant;

  return (
    <KPIRow data-testid="tenant-kpis">
      <KPI label="Active Leases" value={<div data-testid="kpi-active-leases">{formatNumber(tenant?.activeLeases !== null && tenant?.activeLeases !== undefined ? tenant.activeLeases : 0, 0)}</div>} />
      <KPI label="Current Balance" value={<div data-testid="kpi-current-balance">{formatCurrencyFromCents(tenant?.currentBalanceCents)}</div>} />
      <KPI label="On-Time Rate" value={<div data-testid="kpi-on-time-rate">{formatPercent(tenant?.onTimeRate, 1, "fraction")}</div>} />
      <KPI label="Open Work Orders" value={<div data-testid="kpi-open-workorders">{formatNumber(tenant?.openWorkOrders !== null && tenant?.openWorkOrders !== undefined ? tenant.openWorkOrders : 0, 0)}</div>} />
    </KPIRow>
  );
}
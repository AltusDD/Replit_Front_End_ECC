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
      <KPI 
        label="Active Leases" 
        value={formatNumber(tenant?.activeLeases !== null && tenant?.activeLeases !== undefined ? tenant.activeLeases : 0, 0)}
        data-testid="kpi-active-leases"
      />
      <KPI 
        label="Current Balance" 
        value={formatCurrencyFromCents(tenant?.currentBalanceCents)}
        data-testid="kpi-current-balance"
      />
      <KPI 
        label="On-Time Rate" 
        value={formatPercent(tenant?.onTimeRate, 1, "fraction")}
        data-testid="kpi-on-time-rate"
      />
      <KPI 
        label="Open Work Orders" 
        value={formatNumber(tenant?.openWorkOrders !== null && tenant?.openWorkOrders !== undefined ? tenant.openWorkOrders : 0, 0)}
        data-testid="kpi-open-workorders"
      />
    </KPIRow>
  );
}
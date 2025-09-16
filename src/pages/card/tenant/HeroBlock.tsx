import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const leases = data.leases ?? [];
  const activeLeaseCount = leases.filter((l: any) => String(l?.status || "").toLowerCase() === "active").length;

  return (
    <div className="ecc-object">
      <KPIRow data-testid="tenant-kpis">
        <KPI
          data-testid="hero.tenant.kpi.activeLeases"
          label="Active Leases"
          value={formatNumber(activeLeaseCount)}
        />
        <KPI
          data-testid="hero.tenant.kpi.balance"
          label="Current Balance"
          value="$0.00"
        />
        <KPI
          data-testid="hero.tenant.kpi.onTimeRate"
          label="On-Time Rate"
          value="95%"
        />
        <KPI
          data-testid="hero.tenant.kpi.openWorkOrders"
          label="Open Work Orders"
          value={formatNumber(0)}
        />
      </KPIRow>
    </div>
  );
}
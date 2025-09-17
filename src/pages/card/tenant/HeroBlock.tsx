import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const leases = data.leases ?? [];

  return (
    <KPIRow data-testid="tenant-kpis">
      <KPI 
        data-testid="kpi-active-leases"
        label="Active Leases" 
        value={
          leases.filter((l: any) => String(l?.status || "").toLowerCase() === "active").length
        } 
      />
      <KPI 
        data-testid="kpi-current-balance"
        label="Current Balance" 
        value="$0" 
      />
      <KPI 
        data-testid="kpi-on-time-rate"
        label="On-Time Rate" 
        value="95%" 
      />
      <KPI 
        data-testid="kpi-open-workorders"
        label="Open Work Orders" 
        value="0" 
      />
    </KPIRow>
  );
}
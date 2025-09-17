import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const leases = data.leases ?? [];

  return (
    <KPIRow data-testid="tenant-kpis">
      <KPI label="Active Leases" value={
        leases.filter((l: any) => String(l?.status || "").toLowerCase() === "active").length
      } data-testid="kpi-active-leases" />
      <KPI label="Current Balance" value="$0" data-testid="kpi-current-balance" />
      <KPI label="On-Time Rate" value="95%" data-testid="kpi-on-time-rate" />
      <KPI label="Open Work Orders" value="0" data-testid="kpi-open-workorders" />
    </KPIRow>
  );
}
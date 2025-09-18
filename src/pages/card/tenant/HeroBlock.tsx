import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases ?? data?.leaseCount)} />
      <KPI data-testid="kpi-current-balance" label="Balance" value={n(data?.balance ?? data?.currentBalance)} currency />
      <KPI 
        data-testid="kpi-on-time-rate" 
        label="On-Time Rate" 
        value={safe<string>(data?.onTimeRate ?? data?.paymentHealth, BLANK)} 
      />
      <KPI 
        data-testid="kpi-open-workorders" 
        label="Open WOs" 
        value={n(data?.openWorkorders ?? data?.workorders)} 
      />
    </KPIRow>
  );
}

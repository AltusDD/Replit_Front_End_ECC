import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases)} />
      <KPI data-testid="kpi-current-balance" label="Balance" value={n(data?.balance)} currency />
      <KPI data-testid="kpi-on-time-rate" label="On-Time Rate" value={safe<string>(data?.onTimeRate, BLANK)} />
      <KPI data-testid="kpi-open-workorders" label="Open WOs" value={n(data?.openWorkorders)} />
      <KPI
        data-testid="tenant-hero-payment-health"
        label="Payment Health"
        value={safe<string>(data?.paymentHealth || data?.payment_health || data?.paymentScore, "—")}
      />
    </KPIRow>
  );
}

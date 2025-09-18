import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const currency = (v?: number | null) => (typeof v === "number" ? formatCurrencyFromCents(v * 100) : BLANK);

  return (
    <KPIRow>
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases || data?.active_leases)} />
      <KPI data-testid="kpi-current-balance" label="Balance" value={currency(data?.balance || data?.currentBalance)} />
      <KPI data-testid="kpi-on-time-rate" label="Payment Health" value={safe<string>(data?.paymentHealth || data?.payment_health || data?.ontimeRate, BLANK)} />
      <KPI data-testid="kpi-open-workorders" label="Open WOs" value={n(data?.openWorkorders || data?.open_workorders)} />
    </KPIRow>
  );
}

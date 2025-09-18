import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-lease-status" label="Status" value={safe<string>(data?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Rent" value={n(data?.rent)} currency />
      <KPI data-testid="kpi-term" label="Term" value={safe<string>(data?.expiration, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={n(data?.balance)} currency />
      <KPI 
        data-testid="kpi-next-due" 
        label="Next Payment Due" 
        value={safe<string>(data?.nextPaymentDue, BLANK)} 
      />
    </KPIRow>
  );
}

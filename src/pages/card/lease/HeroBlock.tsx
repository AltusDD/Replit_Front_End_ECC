import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const status = data.lease?.status || "Unknown";
  
  return (
    <KPIRow data-testid="lease-kpis">
      <KPI data-testid="kpi-lease-status" label="Status" value={status} />
      <KPI data-testid="kpi-rent" label="Monthly Rent" value={formatCurrencyFromCents(data.lease?.rent_cents)} />
      <KPI data-testid="kpi-term" label="Term" value={
        data.lease?.start_date && data.lease?.end_date
          ? `${data.lease.start_date} → ${data.lease.end_date}`
          : "—"
      } />
      <KPI data-testid="kpi-balance" label="Balance" value="$0" />
    </KPIRow>
  );
}
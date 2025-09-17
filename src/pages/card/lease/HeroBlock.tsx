import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Extract lease data with safe access
  const lease = data.lease;

  return (
    <KPIRow data-testid="lease-kpis">
      <KPI 
        label="Status" 
        value={lease?.status ?? BLANK}
        data-testid="kpi-lease-status"
      />
      <KPI 
        label="Monthly Rent" 
        value={formatCurrencyFromCents(lease?.rentCents)}
        data-testid="kpi-rent"
      />
      <KPI 
        label="Term" 
        value={lease?.term ?? BLANK}
        data-testid="kpi-term"
      />
      <KPI 
        label="Balance" 
        value={formatCurrencyFromCents(lease?.balanceCents)}
        data-testid="kpi-balance"
      />
    </KPIRow>
  );
}
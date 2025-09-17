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
      <KPI label="Status" value={<div data-testid="kpi-lease-status">{lease?.status ?? BLANK}</div>} />
      <KPI label="Monthly Rent" value={<div data-testid="kpi-rent">{formatCurrencyFromCents(lease?.rentCents)}</div>} />
      <KPI label="Term" value={<div data-testid="kpi-term">{lease?.term ?? BLANK}</div>} />
      <KPI label="Balance" value={<div data-testid="kpi-balance">{formatCurrencyFromCents(lease?.balanceCents)}</div>} />
    </KPIRow>
  );
}
import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const lease = data?.lease;

  return (
    <KPIRow data-testid="lease-kpis">
      <KPI label="Status" value={<div data-testid="kpi-lease-status">{lease?.status ?? BLANK}</div>} />
      <KPI label="Monthly Rent" value={<div data-testid="kpi-rent">{formatCurrencyFromCents(lease?.rent_cents)}</div>} />
      <KPI label="Term" value={<div data-testid="kpi-term">{lease?.term ?? BLANK}</div>} />
      <KPI label="Balance" value={<div data-testid="kpi-balance">{formatCurrencyFromCents(lease?.balance_cents)}</div>} />
    </KPIRow>
  );
}
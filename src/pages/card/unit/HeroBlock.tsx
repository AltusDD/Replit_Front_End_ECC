import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const unit = data?.unit;
  const lease = data?.lease;

  return (
    <KPIRow data-testid="unit-kpis">
      <KPI label="Status" value={<div data-testid="kpi-lease-status">{lease?.status ?? unit?.status ?? BLANK}</div>} />
      <KPI label="Rent" value={<div data-testid="kpi-rent">{formatCurrencyFromCents(lease?.rent_cents)}</div>} />
      <KPI label="Bed/Bath" value={
        <div data-testid="kpi-bedbath">
          {`${formatNumber(unit?.beds || unit?.bedrooms)} bd / ${formatNumber(unit?.baths || unit?.bathrooms)} ba`}
        </div>
      } />
      <KPI label="Sq Ft" value={<div data-testid="kpi-sqft">{formatNumber(unit?.sqft)}</div>} />
    </KPIRow>
  );
}
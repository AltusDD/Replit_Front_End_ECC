import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Extract unit and lease data with safe access
  const unit = data.unit;
  const lease = data.lease;

  return (
    <KPIRow data-testid="unit-kpis">
      <KPI label="Status" value={<div data-testid="kpi-lease-status">{unit?.leaseStatus ?? BLANK}</div>} />
      <KPI label="Rent" value={<div data-testid="kpi-rent">{formatCurrencyFromCents(unit?.rentCents)}</div>} />
      <KPI label="Bed/Bath" value={
        <div data-testid="kpi-bedbath">
          {`${formatNumber(unit?.bedrooms !== null && unit?.bedrooms !== undefined ? unit.bedrooms : 0, 0)} bd / ${formatNumber(unit?.bathrooms !== null && unit?.bathrooms !== undefined ? unit.bathrooms : 0, 0)} ba`}
        </div>
      } />
      <KPI label="Sq Ft" value={<div data-testid="kpi-sqft">{formatNumber(unit?.sqft, 0)}</div>} />
    </KPIRow>
  );
}
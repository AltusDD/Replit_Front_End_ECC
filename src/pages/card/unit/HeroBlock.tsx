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
      <KPI 
        label="Status" 
        value={unit?.leaseStatus ?? BLANK}
        data-testid="kpi-lease-status"
      />
      <KPI 
        label="Rent" 
        value={formatCurrencyFromCents(unit?.rentCents)}
        data-testid="kpi-rent"
      />
      <KPI 
        label="Bed/Bath" 
        value={`${formatNumber(unit?.bedrooms !== null && unit?.bedrooms !== undefined ? unit.bedrooms : 0, 0)} bd / ${formatNumber(unit?.bathrooms !== null && unit?.bathrooms !== undefined ? unit.bathrooms : 0, 0)} ba`}
        data-testid="kpi-bedbath"
      />
      <KPI 
        label="Sq Ft" 
        value={formatNumber(unit?.sqft, 0)}
        data-testid="kpi-sqft"
      />
    </KPIRow>
  );
}
import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const status = data.lease?.status || data.unit?.status || "Vacant";
  
  return (
    <KPIRow data-testid="unit-kpis">
      <KPI data-testid="kpi-lease-status" label="Status" value={status} />
      <KPI data-testid="kpi-rent" label="Rent" value={formatCurrencyFromCents(data.lease?.rent_cents)} />
      <KPI data-testid="kpi-bedbath" label="Bed/Bath" value={
        (typeof data.unit?.beds === "number" && typeof data.unit?.baths === "number")
          ? `${data.unit.beds}/${data.unit.baths}`
          : "—"
      } />
      <KPI data-testid="kpi-sqft" label="Sq Ft" value={formatNumber(data.unit?.sqft)} />
    </KPIRow>
  );
}
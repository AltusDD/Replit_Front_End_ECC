import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatNumber, formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <div className="ecc-object">
      <KPIRow data-testid="unit-kpis">
        <KPI
          data-testid="hero.unit.kpi.status"
          label="Status"
          value={data.lease?.status ?? data.unit?.status ?? BLANK}
        />
        <KPI
          data-testid="hero.unit.kpi.rent"
          label="Rent"
          value={formatCurrencyFromCents(data.lease?.rent_cents)}
        />
        <KPI
          data-testid="hero.unit.kpi.bedBath"
          label="Bed/Bath"
          value={
            (typeof data.unit?.beds === "number" && typeof data.unit?.baths === "number")
              ? `${data.unit.beds}/${data.unit.baths}`
              : BLANK
          }
        />
        <KPI
          data-testid="hero.unit.kpi.sqft"
          label="Sq Ft"
          value={formatNumber(data.unit?.sqft)}
        />
      </KPIRow>
    </div>
  );
}
import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPI";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Access unit data from the nested structure expected by the test  
  const unit = data?.unit || data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-lease-status" label="Status" value={safe<string>(unit?.lease_status, "—")} />
      <KPI data-testid="kpi-rent" label="Market Rent" value={unit?.market_rent_cents ? `$${(unit.market_rent_cents / 100).toLocaleString()}` : "—"} />
      <KPI data-testid="kpi-bedbath" label="Beds/Baths" value={unit?.beds && unit?.baths ? `${unit.beds} / ${unit.baths}` : BLANK} />
      <KPI data-testid="kpi-sqft" label="Sq Ft" value={n(unit?.sq_ft)} />
    </KPIRow>
  );
}

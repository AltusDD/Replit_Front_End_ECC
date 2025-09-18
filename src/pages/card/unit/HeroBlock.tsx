import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  // Tiny helpers identical to the other cards
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  
  // Accept either data.unit or data itself
  const unit = data?.unit ?? data;
  
  const bedsBaths = unit?.beds !== undefined && unit?.baths !== undefined 
    ? `${unit.beds}bd/${unit.baths}ba`
    : BLANK;

  return (
    <KPIRow>
      {/* REQUIRED literal test-ids for guardrail */}
      <KPI data-testid="kpi-lease-status" label="Lease Status" value={safe(unit?.status, BLANK)} />
      <KPI data-testid="kpi-rent" label="Rent" value={n(unit?.rent_cents ? unit.rent_cents / 100 : unit?.rent as number)} currency />
      <KPI data-testid="kpi-bedbath" label="Beds/Baths" value={bedsBaths} />
      <KPI data-testid="kpi-sqft" label="Sq Ft" value={n(unit?.sq_ft ?? unit?.sqft)} />
    </KPIRow>
  );
}

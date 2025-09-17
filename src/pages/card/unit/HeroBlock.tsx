import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="unit-kpis">
      <KPI 
        data-testid="kpi-lease-status"
        label="Status" 
        value={data.lease?.status ?? data.unit?.status ?? "—"} 
      />
      <KPI 
        data-testid="kpi-rent"
        label="Rent" 
        value={
          typeof data.lease?.rent_cents === "number"
            ? `$${Math.round(data.lease.rent_cents / 100).toLocaleString()}`
            : "—"
        } 
      />
      <KPI 
        data-testid="kpi-bedbath"
        label="Bed/Bath" 
        value={
          (typeof data.unit?.beds === "number" && typeof data.unit?.baths === "number")
            ? `${data.unit.beds}/${data.unit.baths}`
            : "—"
        } 
      />
      <KPI 
        data-testid="kpi-sqft"
        label="Sq Ft" 
        value={n(data.unit?.sqft)?.toLocaleString() ?? "—"} 
      />
    </KPIRow>
  );
}
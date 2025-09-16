import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="unit-kpis">
      <KPI label="Status" value={data.lease?.status ?? data.unit?.status ?? "—"} />
      <KPI label="Rent" value={
        typeof data.lease?.rent_cents === "number"
          ? `$${Math.round(data.lease.rent_cents / 100).toLocaleString()}`
          : "—"
      } />
      <KPI label="Bed/Bath" value={
        (typeof data.unit?.beds === "number" && typeof data.unit?.baths === "number")
          ? `${data.unit.beds}/${data.unit.baths}`
          : "—"
      } />
      <KPI label="Sq Ft" value={n(data.unit?.sqft)?.toLocaleString() ?? "—"} />
    </KPIRow>
  );
}
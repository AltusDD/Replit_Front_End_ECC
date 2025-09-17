import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="unit-kpis">
      <KPI label="Status" value={data.lease?.status ?? data.unit?.status} data-testid="kpi-lease-status" />
      <KPI label="Rent" value={
        typeof data.lease?.rent_cents === "number"
          ? `$${Math.round(data.lease.rent_cents / 100).toLocaleString()}`
          : undefined
      } data-testid="kpi-rent" />
      <KPI label="Bed/Bath" value={
        (typeof data.unit?.beds === "number" && typeof data.unit?.baths === "number")
          ? `${data.unit.beds}/${data.unit.baths}`
          : undefined
      } data-testid="kpi-bedbath" />
      <KPI label="Sq Ft" value={n(data.unit?.sqft)?.toLocaleString()} data-testid="kpi-sqft" />
    </KPIRow>
  );
}
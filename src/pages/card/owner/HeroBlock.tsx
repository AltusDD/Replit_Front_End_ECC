import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(data?.propertyCount ?? data?.units)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases ?? data?.unitCount)} />
      <KPI 
        data-testid="kpi-occupancy" 
        label="Occupancy" 
        value={safe<string>(data?.occupancy ?? data?.occupancyRate, BLANK)} 
      />
      <KPI 
        data-testid="kpi-avg-rent" 
        label="Avg Rent" 
        value={n(data?.averageRent ?? data?.avgRent)} 
        currency 
      />
    </KPIRow>
  );
}

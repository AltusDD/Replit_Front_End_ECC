import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Portfolio Units" value={n(data?.propertyCount)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={safe<string>(data?.occupancy, "—")} />
      <KPI data-testid="kpi-avg-rent" label="Avg Rent" value={n(data?.avgRent)} currency />
      <KPI 
        data-testid="kpi-vacancy-cost" 
        label="Vacancy Cost" 
        value={n(data?.vacancyCost)} 
        currency 
      />
    </KPIRow>
  );
}

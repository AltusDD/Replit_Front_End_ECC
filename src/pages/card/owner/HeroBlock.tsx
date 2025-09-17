import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="owner-kpis">
      <KPI 
        data-testid="kpi-portfolio-units"
        label="Portfolio Units" 
        value={n(data.kpis?.units)?.toLocaleString() ?? "—"} 
      />
      <KPI 
        data-testid="kpi-active-leases"
        label="Active Leases" 
        value={n(data.kpis?.activeLeases)?.toLocaleString() ?? "—"} 
      />
      <KPI 
        data-testid="kpi-occupancy"
        label="Occupancy" 
        value={
          typeof data.kpis?.occupancyPct === "number"
            ? `${Math.round(data.kpis.occupancyPct)}%`
            : "—"
        } 
      />
      <KPI 
        data-testid="kpi-avg-rent"
        label="Avg Rent" 
        value={
          typeof data.kpis?.avgRentCents === "number"
            ? `$${Math.round(data.kpis.avgRentCents / 100).toLocaleString()}`
            : "—"
        } 
      />
    </KPIRow>
  );
}
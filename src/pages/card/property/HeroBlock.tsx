import { KPIRow } from "@/components/cardkit/KPIRow";
import { KPI } from "@/components/cardkit/KPI";

export default function HeroBlock({ data }: { data: any }) {
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <>
      <KPIRow data-testid="property-kpis">
        <KPI
          data-testid="kpi-units"
          label="Units"
          value={
            n(data.kpis?.units) !== undefined
              ? n(data.kpis?.units)!.toLocaleString()
              : "—"
          }
        />
        <KPI
          data-testid="kpi-active"
          label="Active Leases"
          value={
            n(data.kpis?.activeLeases) !== undefined
              ? n(data.kpis?.activeLeases)!.toLocaleString()
              : "—"
          }
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
          data-testid="kpi-avgrent"
          label="Avg Rent"
          value={
            typeof data.kpis?.avgRentCents === "number"
              ? `$${Math.round(data.kpis.avgRentCents / 100).toLocaleString()}`
              : "—"
          }
        />
      </KPIRow>
      <span data-testid="address" style={{ display: "none" }} />
    </>
  );
}
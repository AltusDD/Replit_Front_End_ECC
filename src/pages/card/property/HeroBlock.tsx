import { KPIRow } from "@/components/cardkit/KPIRow";
import { KPI } from "@/components/cardkit/KPI";
import { formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const addressParts = [
    data.property?.address?.line1,
    data.property?.address?.city,
    data.property?.address?.state,
    data.property?.address?.zip
  ].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(", ") : "No address";

  return (
    <>
      <div data-testid="address" style={{ marginBottom: "16px", fontSize: "14px", opacity: 0.8 }}>
        {address}
      </div>
      <KPIRow data-testid="property-kpis">
        <KPI data-testid="kpi-units" label="Units" value={formatNumber(data.kpis?.units)} />
        <KPI data-testid="kpi-active" label="Active Leases" value={formatNumber(data.kpis?.activeLeases)} />
        <KPI data-testid="kpi-occupancy" label="Occupancy" value={formatPercent(data.kpis?.occupancyPct)} />
        <KPI data-testid="kpi-avgrent" label="Avg Rent" value={formatCurrencyFromCents(data.kpis?.avgRentCents)} />
      </KPIRow>
    </>
  );
}
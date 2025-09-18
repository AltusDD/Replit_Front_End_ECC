import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const currency = (v?: number | null) => (typeof v === "number" ? formatCurrencyFromCents(v * 100) : BLANK);

  return (
    <KPIRow>
      <KPI data-testid="kpi-portfolio-units" label="Units" value={n(data?.unitCount || data?.portfolioUnits)} />
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases || data?.active_leases)} />
      <KPI data-testid="kpi-occupancy" label="Occupancy" value={safe<string>(data?.occupancy ? `${data.occupancy}%` : "—", "—")} />
      <KPI data-testid="kpi-avg-rent" label="Vacancy Cost" value={currency(data?.vacancyCost || data?.vacancy_cost || data?.avgRent)} />
    </KPIRow>
  );
}

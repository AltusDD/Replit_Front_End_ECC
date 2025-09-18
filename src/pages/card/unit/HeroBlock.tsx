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
      <KPI data-testid="kpi-lease-status" label="Status" value={safe<string>(data?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Rent" value={currency(data?.rent || data?.marketRent)} />
      <KPI data-testid="kpi-bedbath" label="Bed/Bath" value={safe<string>(data?.bedsBaths || data?.bedbath, BLANK)} />
      <KPI data-testid="kpi-sqft" label="Sq Ft" value={n(data?.sqft)} />
    </KPIRow>
  );
}

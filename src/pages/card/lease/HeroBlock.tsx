import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { HERO_KPI_TEST_IDS } from "@/features/dashboard/constants/testIds";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="lease-kpis">
      <KPI label="Status" value={data.lease?.status} data-testid="kpi-lease-status" />
      <KPI label="Monthly Rent" value={
        typeof data.lease?.rent_cents === "number"
          ? `$${Math.round(data.lease.rent_cents / 100).toLocaleString()}`
          : undefined
      } data-testid="kpi-rent" />
      <KPI label="Term" value={
        data.lease?.start_date && data.lease?.end_date
          ? `${data.lease.start_date} → ${data.lease.end_date}`
          : undefined
      } data-testid="kpi-term" />
      <KPI label="Balance" value="$0" data-testid="kpi-balance" />
    </KPIRow>
  );
}
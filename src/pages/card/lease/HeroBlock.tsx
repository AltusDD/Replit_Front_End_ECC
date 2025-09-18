import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPI";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  // Access lease data from the nested structure expected by the test
  const lease = data?.lease || data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-lease-status" label="Status" value={safe<string>(lease?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Rent" value={lease?.rent_cents ? `$${(lease.rent_cents / 100).toLocaleString()}` : "—"} />
      <KPI data-testid="kpi-term" label="Term" value={safe<string>(lease?.term, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={lease?.balance_cents ? `$${(lease.balance_cents / 100).toLocaleString()}` : "—"} />
    </KPIRow>
  );
}

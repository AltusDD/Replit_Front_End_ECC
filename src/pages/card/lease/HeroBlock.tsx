import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK, formatCurrencyFromCents } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const lease = data?.lease ?? data;

  return (
    <KPIRow>
      <KPI data-testid="kpi-lease-status" label="Lease Status" value={safe(lease?.status, "—")} />
      <KPI data-testid="kpi-rent" label="Monthly Rent" value={formatCurrencyFromCents(lease?.rent_cents ?? lease?.rent)} />
      <KPI data-testid="kpi-term" label="Term" value={safe(lease?.term ?? lease?.expiration, BLANK)} />
      <KPI data-testid="kpi-balance" label="Balance" value={formatCurrencyFromCents(lease?.balance_cents ?? lease?.balance)} />
      {/* NEW: next due (string date or friendly text) */}
      <KPI data-testid="kpi-next-due" label="Next Due" value={safe<string>(lease?.next_due ?? lease?.next_due_date, BLANK)} />
    </KPIRow>
  );
}

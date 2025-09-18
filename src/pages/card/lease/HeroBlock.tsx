import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) =>
    typeof v === "number" && Number.isFinite(v) ? v : undefined;

  // Accept either data.lease or data itself
  const lease = data?.lease ?? data;

  return (
    <KPIRow>
      {/* REQUIRED literal test-ids for guardrail */}
      <KPI
        data-testid="kpi-lease-status"
        label="Lease Status"
        value={safe(lease?.status, "—")}
      />
      <KPI
        data-testid="kpi-rent"
        label="Monthly Rent"
        value={n(
          (lease?.rent_cents ?? lease?.rent) as number
        )
          ? ((lease?.rent_cents ?? lease?.rent) as number) / 100
          : undefined}
        currency
      />
      <KPI
        data-testid="kpi-term"
        label="Term"
        value={safe(lease?.term ?? lease?.expiration, BLANK)}
      />
      <KPI
        data-testid="kpi-balance"
        label="Balance"
        value={n(
          (lease?.balance_cents ?? lease?.balance) as number
        )
          ? ((lease?.balance_cents ?? lease?.balance) as number) / 100
          : undefined}
        currency
      />
    </KPIRow>
  );
}

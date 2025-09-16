import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { formatCurrencyFromCents, BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <div className="ecc-object">
      <KPIRow data-testid="lease-kpis">
        <KPI
          data-testid="hero.lease.kpi.status"
          label="Status"
          value={data.lease?.status ?? BLANK}
        />
        <KPI
          data-testid="hero.lease.kpi.rent"
          label="Monthly Rent"
          value={formatCurrencyFromCents(data.lease?.rent_cents)}
        />
        <KPI
          data-testid="hero.lease.kpi.term"
          label="Term"
          value={
            data.lease?.start_date && data.lease?.end_date
              ? `${data.lease.start_date} → ${data.lease.end_date}`
              : BLANK
          }
        />
        <KPI
          data-testid="hero.lease.kpi.balance"
          label="Balance"
          value="$0.00"
        />
      </KPIRow>
    </div>
  );
}
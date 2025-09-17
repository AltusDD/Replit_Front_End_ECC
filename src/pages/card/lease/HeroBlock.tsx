import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow data-testid="lease-kpis">
      <KPI 
        data-testid="kpi-lease-status"
        label="Status" 
        value={data.lease?.status ?? "—"} 
      />
      <KPI 
        data-testid="kpi-rent"
        label="Monthly Rent" 
        value={
          typeof data.lease?.rent_cents === "number"
            ? `$${Math.round(data.lease.rent_cents / 100).toLocaleString()}`
            : "—"
        } 
      />
      <KPI 
        data-testid="kpi-term"
        label="Term" 
        value={
          data.lease?.start_date && data.lease?.end_date
            ? `${data.lease.start_date} → ${data.lease.end_date}`
            : "—"
        } 
      />
      <KPI 
        data-testid="kpi-balance"
        label="Balance" 
        value="$0" 
      />
    </KPIRow>
  );
}
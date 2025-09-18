import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      <KPI
        data-testid="kpi-lease-status"
        label="Lease Status"
        value={safe<string>(data?.leaseStatus ?? data?.status, "—")}
      />
      <KPI
        data-testid="kpi-rent"
        label="Rent"
        value={n(data?.rent ?? data?.marketRent)}
        currency
      />
      <KPI
        data-testid="kpi-bedbath"
        label="Bed/Bath"
        value={safe<string>(data?.bedsBaths ?? data?.bedBath, BLANK)}
      />
      <KPI 
        data-testid="kpi-sqft"
        label="Sq Ft" 
        value={n(data?.sqft)} 
      />
    </KPIRow>
  );
}

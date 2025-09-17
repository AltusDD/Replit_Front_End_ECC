import { KPI } from "@/components/cardkit/KPI";
import { KPIRow } from "@/components/cardkit/KPIRow";
import { TESTIDS } from "@/testing/testIds";
import { BLANK } from "@/lib/format";

export default function HeroBlock({ data }: { data: any }) {
  const safe = <T,>(v: T | null | undefined, d: T) => (v ?? d);
  const n = (v?: number | null) => (typeof v === "number" ? v : undefined);
  const pct = (v?: number | null) => (typeof v === "number" ? v : undefined);

  return (
    <KPIRow>
      {/* Guardrail-required IDs */}
      <KPI data-testid="kpi-active-leases" label="Active Leases" value={n(data?.activeLeases)} />
      <KPI data-testid="kpi-current-balance" label="Current Balance" value={n(data?.balance)} currency />
      <KPI data-testid="kpi-on-time-rate" label="On-Time Rate" value={pct(data?.onTimeRate)} percent />
      <KPI data-testid="kpi-open-workorders" label="Open Workorders" value={n(data?.openWorkorders)} />

      {/* Central-test aliases (keep for existing unit/e2e tests) */}
      <KPI data-testid={TESTIDS.TENANT_HERO_BALANCE} label="Balance (alias)" value={n(data?.balance)} currency />
      <KPI data-testid={TESTIDS.TENANT_HERO_STATUS} label="Status (alias)" value={safe<string>(data?.status, "—")} />
      <KPI label="Since" value={safe<string>(data?.since, BLANK)} />
      <KPI label="Phone" value={safe<string>(data?.phone, BLANK)} />
    </KPIRow>
  );
}
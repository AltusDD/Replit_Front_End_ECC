import { useQuery } from "@tanstack/react-query";

export type DashboardKpis = {
  propertiesTotal: number;   // expected live count
  unitsTotal: number;        // expected live count
  occupancyRate: number;     // 0..1 fraction
  delinquencyRate?: number;  // normalized
  totalUnits?: number;
  occupiedUnits?: number;
  vacantUnits?: number;
  totalRent?: number;
  collectedRent?: number;
  outstandingRent?: number;
  lastUpdated?: string | null;
  revenue30dCents?: number;  // optional cents
  series?: { date: string; occupancy: number }[]; // 0..1
};

function numOrZero(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/dashboard/kpi/summary", { signal });
      if (!res.ok) throw new Error(`Failed KPIs: ${res.status}`);
      const raw = (await res.json()) as any;
      const data: DashboardKpis = {
        ...(raw ?? {}),
        propertiesTotal: numOrZero(raw?.propertiesTotal),
        unitsTotal: numOrZero(raw?.unitsTotal),
        occupancyRate: numOrZero(raw?.occupancyRate),
        delinquencyRate: numOrZero(raw?.delinquencyRate),
        totalUnits: numOrZero(raw?.totalUnits),
        occupiedUnits: numOrZero(raw?.occupiedUnits),
        vacantUnits: numOrZero(raw?.vacantUnits),
        totalRent: numOrZero(raw?.totalRent),
        collectedRent: numOrZero(raw?.collectedRent),
        outstandingRent: numOrZero(raw?.outstandingRent),
        lastUpdated: raw?.lastUpdated ?? null,
      };
      return data;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

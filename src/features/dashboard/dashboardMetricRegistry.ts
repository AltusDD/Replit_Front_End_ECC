import { formatCurrencyFromCents, formatNumber, formatPercent, BLANK } from "@/lib/format";
import type { DashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";

type DashboardMetricDefinition = {
  key: string;
  label: string;
  helper: string;
  render: (data: DashboardKpis) => string;
};

const METRICS: DashboardMetricDefinition[] = [
  {
    key: "properties",
    label: "Properties",
    helper: "Total properties currently in the portfolio command surface.",
    render: (data) => formatNumber(data.propertiesTotal ?? 0),
  },
  {
    key: "units",
    label: "Units",
    helper: "Total units represented by the live portfolio summary feed.",
    render: (data) => formatNumber(data.unitsTotal ?? 0),
  },
  {
    key: "occupancy",
    label: "Occupancy",
    helper: "Live portfolio occupancy pulled into the dashboard summary route.",
    render: (data) => (data.occupancyRate !== undefined ? formatPercent(data.occupancyRate, 1, "fraction") : BLANK),
  },
  {
    key: "revenue_30d",
    label: "Revenue (30d)",
    helper: "Recent 30-day revenue shown for war-room level command readout.",
    render: (data) => formatCurrencyFromCents(data.revenue30dCents ?? 0),
  },
];

export function buildDashboardMetricCards(data: DashboardKpis) {
  return METRICS.map((metric) => ({
    key: metric.key,
    label: metric.label,
    helper: metric.helper,
    value: metric.render(data),
  }));
}

export function buildDashboardFilterSummary(data: DashboardKpis) {
  const seriesCount = data.series?.length ?? 0;

  return [
    { key: "scope", label: "Scope", value: "Portfolio command" },
    { key: "window", label: "Window", value: "30 days" },
    { key: "series", label: "Trend points", value: formatNumber(seriesCount) },
    {
      key: "occupancy",
      label: "Occupancy",
      value: data.occupancyRate !== undefined ? formatPercent(data.occupancyRate, 1, "fraction") : BLANK,
    },
  ];
}

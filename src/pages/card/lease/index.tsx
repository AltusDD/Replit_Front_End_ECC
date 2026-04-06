import { useRoute } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CardShell } from "@/components/cardkit/CardShell";
import RightRailPanel from "@/components/cardkit/RightRailPanel";
import HeroBlock from "./HeroBlock";
import Overview from "./Overview";
import { useLeaseCard } from "@/lib/ecc-resolvers";

export default function LeaseCardPage() {
  const [, params] = useRoute("/card/lease/:id");
  const idNum = Number(params?.id);
  const q = useLeaseCard(idNum);
  if (!Number.isFinite(idNum)) return <div data-testid="lease-invalid">Invalid lease id</div>;

  const { data } = q;
  const lease = data?.lease;
  const unit = data?.unit;
  const tenant = data?.tenant;
  const leaseLabel = lease?.doorloop_id ? `Lease ${lease.doorloop_id}` : `Lease #${idNum}`;
  const unitLabel = unit?.unit_label ?? unit?.unit_number ?? "Not available";
  const leaseStatus = lease?.status ?? "Not available";
  const leaseStart = lease?.start_date ?? "Not available";
  const leaseEnd = lease?.end_date ?? "Not available";
  const tenantLabel =
    tenant?.display_name ?? tenant?.name ?? (tenant?.id ? `Tenant #${tenant.id}` : "Not available");

  const breadcrumbs = ["Portfolio", "Leases", leaseLabel];
  const actions = [
    { label: "Export PDF", testid: "action-export-pdf" },
    { label: "Edit", testid: "action-edit" },
  ];

  const tabs = [
    { id: "overview", title: "Overview", element: <Overview data={data} />, testid: "tab-overview" },
    { id: "financials", title: "Financials", lazy: () => import("./Financials"), props: { data }, testid: "tab-financials" },
    { id: "legal", title: "Legal", lazy: () => import("./Legal"), props: { data }, testid: "tab-legal" },
    { id: "files", title: "Files", lazy: () => import("./Files"), props: { data }, testid: "tab-files" },
  ];

  const rightRail = (
    <div className="space-y-4">
      <RightRailPanel title="Lease Info" data-testid="rr-lease">
        <div className="text-sm text-neutral-300">Status: {leaseStatus}</div>
        <div className="text-sm text-neutral-300">Start: {leaseStart}</div>
        <div className="text-sm text-neutral-300">End: {leaseEnd}</div>
      </RightRailPanel>
      <RightRailPanel title="Related" data-testid="rr-related">
        <div className="text-sm text-neutral-300">Unit: {unitLabel}</div>
        <div className="text-sm text-neutral-300">Tenant: {tenantLabel}</div>
      </RightRailPanel>
    </div>
  );

  return (
    <ErrorBoundary>
      <CardShell
        title={leaseLabel}
        hero={<HeroBlock data={data} isLoading={q.isLoading} />}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
        actions={actions}
        rightRail={rightRail}
      />
    </ErrorBoundary>
  );
}

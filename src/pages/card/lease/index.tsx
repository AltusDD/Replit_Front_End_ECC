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

  const breadcrumbs = ["Portfolio", "Leases", `Lease #${idNum}`];
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
        <div className="text-sm text-neutral-300">Status: {lease?.status}</div>
        <div className="text-sm text-neutral-300">Start: {lease?.start_date}</div>
        <div className="text-sm text-neutral-300">End: {lease?.end_date}</div>
      </RightRailPanel>
      <RightRailPanel title="Related" data-testid="rr-related">
        <div className="text-sm text-neutral-300">Unit: {unit?.unit_number}</div>
        <div className="text-sm text-neutral-300">Tenant: {tenant?.display_name}</div>
      </RightRailPanel>
    </div>
  );

  return (
    <ErrorBoundary>
      <CardShell
        title={`Lease #${idNum}`}
        hero={<HeroBlock data={data} isLoading={q.isLoading} />}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
        actions={actions}
        rightRail={rightRail}
      />
    </ErrorBoundary>
  );
}

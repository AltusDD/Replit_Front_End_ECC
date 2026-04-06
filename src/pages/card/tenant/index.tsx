import { useRoute } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CardShell } from "@/components/cardkit/CardShell";
import RightRailPanel from "@/components/cardkit/RightRailPanel";
import HeroBlock from "./HeroBlock";
import Overview from "./Overview";
import { useTenantCard } from "@/lib/ecc-resolvers";

export default function TenantCardPage() {
  const [, params] = useRoute("/card/tenant/:id");
  const idNum = Number(params?.id);
  const q = useTenantCard(idNum);
  if (!Number.isFinite(idNum)) return <div data-testid="tenant-invalid">Invalid tenant id</div>;

  const { data } = q;
  const tenant = data?.tenant;
  const lease = data?.activeLease ?? null;
  const normalizedData = data ? { ...data, lease } : data;

  const breadcrumbs = ["Portfolio", "Tenants", tenant?.display_name ?? `Tenant #${idNum}`];
  const actions = [
    { label: "Export PDF", testid: "action-export-pdf" },
    { label: "Edit", testid: "action-edit" },
  ];

  const tabs = [
    { id: "overview", title: "Overview", element: <Overview tenant={tenant} activeLease={lease || null} />, testid: "tab-overview" },
    { id: "financials", title: "Financials", lazy: () => import("./Financials"), props: { data: normalizedData }, testid: "tab-financials" },
    { id: "legal", title: "Legal", lazy: () => import("./Legal"), props: { data: normalizedData }, testid: "tab-legal" },
    { id: "files", title: "Files", lazy: () => import("./Files"), props: { data: normalizedData }, testid: "tab-files" },
  ];

  const rightRail = (
    <div className="space-y-4">
      <RightRailPanel title="Contact Info" data-testid="rr-contact">
        <div className="text-sm text-neutral-300">Email: {tenant?.email}</div>
        <div className="text-sm text-neutral-300">Phone: {tenant?.phone}</div>
      </RightRailPanel>
      <RightRailPanel title="Current Lease" data-testid="rr-lease">
        <div className="text-sm text-neutral-300">Lease: {lease?.doorloop_id ?? lease?.id ?? "No active lease"}</div>
        <div className="text-sm text-neutral-300">Status: {lease?.status ?? "Not available"}</div>
      </RightRailPanel>
    </div>
  );

  return (
    <ErrorBoundary>
      <CardShell
        title={tenant?.display_name ?? `Tenant #${idNum}`}
        hero={<HeroBlock data={data} isLoading={q.isLoading} />}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
        actions={actions}
        rightRail={rightRail}
      />
    </ErrorBoundary>
  );
}

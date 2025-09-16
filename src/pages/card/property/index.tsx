import { useRoute } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CardShell } from "@/components/cardkit/CardShell";
import RightRailPanel from "@/components/cardkit/RightRailPanel";
import HeroBlock from "./HeroBlock";
import Overview from "./Overview";
import { usePropertyCard } from "@/lib/ecc-resolvers";

export default function PropertyCardPage() {
  const [, params] = useRoute("/card/property/:id");
  const idNum = Number(params?.id);
  const q = usePropertyCard(idNum);
  if (!Number.isFinite(idNum)) return <div data-testid="prop-invalid">Invalid property id</div>;

  const { data } = q;
  const property = data?.property;
  const owner = data?.owner;
  const counts = { 
    units: data?.kpis?.units !== undefined ? data.kpis.units : 0, 
    activeLeases: data?.kpis?.activeLeases !== undefined ? data.kpis.activeLeases : 0 
  };

  const breadcrumbs = ["Portfolio", "Properties", property?.name ?? `Property #${idNum}`];
  const actions = [
    { label: "Export PDF", testid: "action-export-pdf" },
    { label: "Edit", testid: "action-edit" },
  ];

  const tabs = [
    { id: "overview", title: "Overview", element: <Overview property={property} owner={owner} counts={counts} />, testid: "tab-overview" },
    { id: "financials", title: "Financials", lazy: () => import("./Financials"), props: { data }, testid: "tab-financials" },
    { id: "legal", title: "Legal", lazy: () => import("./Legal"), props: { data }, testid: "tab-legal" },
    { id: "files", title: "Files", lazy: () => import("./Files"), props: { data }, testid: "tab-files" },
  ];

  const rightRail = (
    <div className="space-y-4">
      <RightRailPanel title="Key Dates" data-testid="rr-dates">
        <div className="text-sm text-neutral-300">Created: {property?.created_at}</div>
        <div className="text-sm text-neutral-300">Updated: {property?.updated_at}</div>
      </RightRailPanel>
      <RightRailPanel title="Contacts" data-testid="rr-contacts">
        <div className="text-sm text-neutral-300">{owner?.display_name}</div>
      </RightRailPanel>
    </div>
  );

  return (
    <ErrorBoundary>
      <CardShell
        title={property?.name ?? `Property #${idNum}`}
        hero={<HeroBlock data={data} isLoading={q.isLoading} />}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
        actions={actions}
        rightRail={rightRail}
      />
    </ErrorBoundary>
  );
}

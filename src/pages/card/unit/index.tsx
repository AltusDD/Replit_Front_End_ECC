import { useRoute } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CardShell } from "@/components/cardkit/CardShell";
import RightRailPanel from "@/components/cardkit/RightRailPanel";
import HeroBlock from "./HeroBlock";
import Overview from "./Overview";
import { useUnitCard } from "@/lib/ecc-resolvers";

export default function UnitCardPage() {
  const [, params] = useRoute("/card/unit/:id");
  const idNum = Number(params?.id);
  const q = useUnitCard(idNum);
  if (!Number.isFinite(idNum)) return <div data-testid="unit-invalid">Invalid unit id</div>;

  const { data } = q;
  const unit = data?.unit;
  const property = data?.property;
  const lease = data?.lease;

  const breadcrumbs = ["Portfolio", "Units", unit?.unit_number ?? `Unit #${idNum}`];
  const actions = [
    { label: "Export PDF", testid: "action-export-pdf" },
    { label: "Edit", testid: "action-edit" },
  ];

  const tabs = [
    { id: "overview", title: "Overview", element: <Overview unit={unit} property={property} />, testid: "tab-overview" },
    { id: "financials", title: "Financials", lazy: () => import("./Financials"), props: { data }, testid: "tab-financials" },
    { id: "legal", title: "Legal", lazy: () => import("./Legal"), props: { data }, testid: "tab-legal" },
    { id: "files", title: "Files", lazy: () => import("./Files"), props: { data }, testid: "tab-files" },
  ];

  const rightRail = (
    <div className="space-y-4">
      <RightRailPanel title="Unit Details" data-testid="rr-details">
        <div className="text-sm text-neutral-300">Beds: {unit?.beds}</div>
        <div className="text-sm text-neutral-300">Baths: {unit?.baths}</div>
        <div className="text-sm text-neutral-300">Sq Ft: {unit?.sqft}</div>
      </RightRailPanel>
      <RightRailPanel title="Property" data-testid="rr-property">
        <div className="text-sm text-neutral-300">{property?.name}</div>
      </RightRailPanel>
    </div>
  );

  return (
    <ErrorBoundary>
      <CardShell
        title={unit?.unit_number ?? `Unit #${idNum}`}
        hero={<HeroBlock data={data} isLoading={q.isLoading} />}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
        actions={actions}
        rightRail={rightRail}
      />
    </ErrorBoundary>
  );
}

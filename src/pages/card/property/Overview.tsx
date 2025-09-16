import { CardPanel } from "@/components/cardkit/CardPanel";
import { FieldGroup } from "@/components/cardkit/FieldGroup";
import { formatNumber } from "@/lib/format";

export default function Overview({ data }: { data: any }) {
  const addressParts = [
    data.property?.address?.line1,
    data.property?.address?.city,
    data.property?.address?.state,
    data.property?.address?.zip
  ].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(", ") : "—";

  return (
    <CardPanel>
      <h3>Overview</h3>
      <FieldGroup label="Type" value={data.property?.type ?? "Unknown"} />
      <FieldGroup label="Owner" value={data.owner?.display_name ?? "Unknown"} />
      <FieldGroup label="Address" value={address} />
      <FieldGroup label="Units" value={formatNumber(data.kpis?.units)} />
      <FieldGroup label="Active Leases" value={formatNumber(data.kpis?.activeLeases)} />
      <FieldGroup label="Class" value={data.property?.property_class ?? "Unknown"} />
      <FieldGroup label="Status" value={data.property?.status ?? "Unknown"} />
      <FieldGroup label="DoorLoop ID" value={data.property?.doorloop_id ?? "None"} />
    </CardPanel>
  );
}
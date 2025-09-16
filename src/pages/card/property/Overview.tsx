import { CardPanel } from "@/components/cardkit/CardPanel";
import { FieldGroup } from "@/components/cardkit/FieldGroup";
import { formatNumber } from "@/lib/format";

export default function Overview({ data }: { data: any }) {
  return (
    <CardPanel>
      <h3>Overview</h3>
      <FieldGroup
        label="Type"
        value={data.property?.type ? data.property.type : "—"}
      />
      <FieldGroup
        label="Owner"
        value={data.owner?.display_name ? data.owner.display_name : "—"}
      />
      <FieldGroup
        label="Address"
        value={
          (() => {
            const addr = [
              data.property?.address?.line1,
              data.property?.address?.city,
              data.property?.address?.state,
              data.property?.address?.zip,
            ]
              .filter(Boolean)
              .join(", ");
            return addr ? addr : "—";
          })()
        }
      />
      <FieldGroup
        label="Units"
        value={formatNumber(data.kpis?.units)}
      />
      <FieldGroup
        label="Active Leases"
        value={formatNumber(data.kpis?.activeLeases)}
      />
      <FieldGroup
        label="Class"
        value={data.property?.property_class ? data.property.property_class : "—"}
      />
      <FieldGroup
        label="Status"
        value={data.property?.status ? data.property.status : "—"}
      />
      <FieldGroup
        label="DoorLoop ID"
        value={data.property?.doorloop_id ? data.property.doorloop_id : "—"}
      />
    </CardPanel>
  );
}
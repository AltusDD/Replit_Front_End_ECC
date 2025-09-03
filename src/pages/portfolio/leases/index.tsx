import React, { useMemo } from "react";
import { SimpleTable } from "@/components/Table";
import { LEASE_COLUMNS, mapLease } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money } from "@/utils/dict";

export default function LeasesPage() {
  const leases = useCollection<any>("leases");
  const tenants = useCollection<any>("tenants");
  const props = useCollection<any>("properties");

  const rows = useMemo(() => {
    const tById = indexBy(tenants.data, "id");
    const pById = indexBy(props.data, "id");
    return (leases.data || []).map((l: any) => {
      const names =
        l.tenant_names ||
        tById.get(l.primary_tenant_id)?.display_name ||
        tById.get(l.tenant_id)?.display_name ||
        tById.get(l.primary_tenant_id)?.full_name ||
        tById.get(l.tenant_id)?.full_name || "";
      return {
        id: l.id ?? l.doorloop_id,
        doorloop_id: l.doorloop_id,
        tenant_names: names,
        property: l.property ?? pById.get(l.property_id)?.name ?? "",
        rent: money(
          l.rent ?? l.total_recurring_rent ?? (typeof l.rent_cents === "number" ? l.rent_cents / 100 : undefined)
        ),
        start: (l.start ?? l.start_date ?? "").toString().slice(0,10),
        end:   (l.end ?? l.end_date ?? "").toString().slice(0,10),
        status: l.status ?? "",
      };
    });
  }, [leases.data, tenants.data, props.data]);

  return (
    <>
      <h1>Leases</h1>
      {leases.error && <div style={{ color: "tomato" }}>{String(leases.error)}</div>}
      <SimpleTable
        columns={LEASE_COLUMNS}
        rows={rows.map(mapLease)}
        empty={leases.loading ? "Loading…" : "No leases"}
      />
    </>
  );
}
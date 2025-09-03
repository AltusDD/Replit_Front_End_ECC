import React, { useMemo } from "react";
import { SimpleTable } from "@/components/Table";
import { OWNER_COLUMNS, mapOwner } from "../columns";
import { useCollection } from "@/features/data/useCollection";

export default function OwnersPage() {
  const owners = useCollection<any>("owners");

  const rows = useMemo(() => {
    return (owners.data || []).map((o:any) => ({
      id: o.id ?? o.doorloop_id,
      doorloop_id: o.doorloop_id,
      name: o.name ?? o.display_name ?? o.full_name ?? [o.first_name, o.last_name].filter(Boolean).join(" "),
      email: o.primary_email ?? o.email ?? "",
      phone: o.primary_phone ?? o.phone ?? "",
      property_count: o.property_count ?? 0,
      active: o.active ?? o.isActive ?? false,
    }));
  }, [owners.data]);

  return (
    <>
      <h1>Owners</h1>
      {owners.error && <div style={{ color: "tomato" }}>{String(owners.error)}</div>}
      <SimpleTable
        columns={OWNER_COLUMNS}
        rows={rows.map(mapOwner)}
        empty={owners.loading ? "Loading…" : "No owners"}
      />
    </>
  );
}
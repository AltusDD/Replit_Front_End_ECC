import React, { useMemo } from "react";
import { SimpleTable } from "@/components/Table";
import { TENANT_COLUMNS, mapTenant } from "../columns";
import { useCollection } from "@/features/data/useCollection";
import { indexBy } from "@/utils/dict";
import { money } from "@/utils/dict";

export default function TenantsPage() {
  const tenants = useCollection<any>("tenants");
  const leases = useCollection<any>("leases");
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const rows = useMemo(() => {
    const uById = indexBy(units.data, "id");
    const pById = indexBy(props.data, "id");

    // Build latest lease per-tenant by updated_at/start_date
    const latest = new Map<any, any>();
    for (const l of leases.data || []) {
      const tids = [l.primary_tenant_id, l.tenant_id].filter(Boolean);
      for (const tid of tids) {
        const cur = latest.get(tid);
        const score = Date.parse(l.updated_at || l.start_date || "") || 0;
        const curScore = cur ? (Date.parse(cur.updated_at || cur.start_date || "") || 0) : -1;
        if (!cur || score >= curScore) latest.set(tid, l);
      }
    }

    return (tenants.data || []).map((t: any) => {
      const l = latest.get(t.id);
      const u = l ? uById.get(l.unit_id) : undefined;
      const p = u ? pById.get(u.property_id) : (l ? pById.get(l.property_id) : undefined);
      const name =
        t.name || t.display_name || t.full_name || [t.first_name, t.last_name].filter(Boolean).join(" ");
      return {
        id: t.id ?? t.doorloop_id,
        doorloop_id: t.doorloop_id,
        name,
        property: p?.name ?? "",
        unit: u?.unit_number ?? u?.number ?? u?.name ?? "",
        email: t.primary_email ?? t.email ?? "",
        phone: t.primary_phone ?? t.phone ?? "",
        status: l?.status ?? t.status ?? t.type ?? "",
        balance: money(t.balance),
      };
    });
  }, [tenants.data, leases.data, units.data, props.data]);

  return (
    <>
      <h1>Tenants</h1>
      {tenants.error && <div style={{ color: "tomato" }}>{String(tenants.error)}</div>}
      <SimpleTable
        columns={TENANT_COLUMNS}
        rows={rows.map(mapTenant)}
        empty={tenants.loading ? "Loading…" : "No tenants"}
      />
    </>
  );
}
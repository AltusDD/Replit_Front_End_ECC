import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";
import { useAllOwners } from "../../lib/ecc-resolvers";
import { BLANK } from "@/lib/format";

type OwnerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  holdings: number | string;
};

export default function Owners() {
  const [q, setQ] = useState("");
  const { data, isLoading, isFetching, error } = useAllOwners();

  const rows = useMemo(() => {
    if (!data) return [];

    const mapped: OwnerRow[] = data.map((owner: any) => ({
      id: String(owner.id),
      name:
        owner.display_name ??
        owner.full_name ??
        owner.name ??
        owner.entity_name ??
        `Owner ${owner.id}`,
      email: owner.email ?? BLANK,
      phone: owner.phone ?? owner.phone_number ?? BLANK,
      holdings:
        owner.holdings ??
        owner.properties_count ??
        owner.property_count ??
        BLANK,
    }));

    const t = q.trim().toLowerCase();
    if (!t) return mapped;
    return mapped.filter((r) =>
      r.name.toLowerCase().includes(t) ||
      r.email.toLowerCase().includes(t) ||
      r.phone.toLowerCase().includes(t) ||
      r.id.toLowerCase().includes(t),
    );
  }, [data, q]);

  const columns: Column<OwnerRow>[] = [
    { key: "id", header: "Owner ID", width: 120 },
    { key: "name", header: "Owner / Entity" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone", width: 160 },
    { key: "holdings", header: "Holdings", width: 120 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar
        title="Owners"
        value={q}
        onChange={setQ}
        placeholder="Search owner / email / phone"
      />
      <DataTable
        columns={columns}
        rows={rows}
        loading={isLoading || (isFetching && rows.length === 0)}
        error={error ? String(error) : undefined}
        rowHref={(r) => `/card/owner/${r.id}`}
        getRowId={(r) => r.id}
      />
    </section>
  );
}

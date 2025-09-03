import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";

type TenantRow = {
  id: string;
  name: string;
  property: string;
  unit: string;
  email: string;
  phone: string;
  status: "Current" | "Former" | "Prospect";
};

const MOCK: TenantRow[] = [
  { id: "T-1001", name: "Jose Morales", property: "Crescent Ridge", unit: "A-102", email: "jose@example.com", phone: "(512) 555-7854", status: "Current" },
  { id: "T-1002", name: "Chau Nguyen", property: "Crescent Ridge", unit: "B-206", email: "chau@example.com", phone: "(512) 555-5512", status: "Prospect" },
  { id: "T-1003", name: "Ramesh Patel", property: "Maple Grove", unit: "3-114", email: "rpatel@example.com", phone: "(303) 555-2173", status: "Former" },
];

export default function Tenants() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOCK;
    return MOCK.filter(r =>
      r.name.toLowerCase().includes(t) ||
      r.property.toLowerCase().includes(t) ||
      r.unit.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [q]);

  const columns: Column<TenantRow>[] = [
    { key: "name", header: "Tenant" },
    { key: "property", header: "Property" },
    { key: "unit", header: "Unit", width: 100 },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone", width: 150 },
    { key: "status", header: "Status", width: 110 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar title="Tenants" value={q} onChange={setQ} placeholder="Search name / property / status" />
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

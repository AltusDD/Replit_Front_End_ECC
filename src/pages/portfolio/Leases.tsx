import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";

type LeaseRow = {
  leaseId: string;
  tenant: string;
  unit: string;
  start: string;
  end: string;
  amount: string;
  status: "Active" | "Pending" | "Closed";
};

const MOCK: LeaseRow[] = [
  { leaseId: "L-2023-001", tenant: "J. Morales", unit: "A-102 (Crescent Ridge)", start: "2023-10-01", end: "2024-09-30", amount: "$1,850", status: "Active" },
  { leaseId: "L-2024-022", tenant: "C. Nguyen", unit: "B-206 (Crescent Ridge)", start: "2024-08-01", end: "2025-07-31", amount: "$1,295", status: "Pending" },
  { leaseId: "L-2022-117", tenant: "R. Patel", unit: "3-114 (Maple Grove)", start: "2022-06-01", end: "2023-05-31", amount: "$2,145", status: "Closed" },
];

export default function Leases() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOCK;
    return MOCK.filter(r =>
      r.leaseId.toLowerCase().includes(t) ||
      r.tenant.toLowerCase().includes(t) ||
      r.unit.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [q]);

  const columns: Column<LeaseRow>[] = [
    { key: "leaseId", header: "Lease ID", width: 140 },
    { key: "tenant", header: "Tenant" },
    { key: "unit", header: "Unit / Property" },
    { key: "start", header: "Start", width: 120 },
    { key: "end", header: "End", width: 120 },
    { key: "amount", header: "Amount", width: 120 },
    { key: "status", header: "Status", width: 110 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar title="Leases" value={q} onChange={setQ} />
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

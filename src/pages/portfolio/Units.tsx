import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";

type UnitRow = {
  id: string;
  property: string;
  unit: string;
  beds: number;
  baths: number;
  status: "Occupied" | "Vacant" | "Notice";
  rent: string;
};

const MOCK: UnitRow[] = [
  { id: "U-1", property: "Crescent Ridge Apts", unit: "A-102", beds: 2, baths: 2, status: "Occupied", rent: "$1,850" },
  { id: "U-2", property: "Crescent Ridge Apts", unit: "B-206", beds: 1, baths: 1, status: "Vacant", rent: "$1,295" },
  { id: "U-3", property: "Maple Grove", unit: "3-114", beds: 3, baths: 2, status: "Notice", rent: "$2,145" },
];

export default function Units() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOCK;
    return MOCK.filter(r =>
      r.property.toLowerCase().includes(t) ||
      r.unit.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [q]);

  const columns: Column<UnitRow>[] = [
    { key: "unit", header: "Unit", width: 100 },
    { key: "property", header: "Property" },
    { key: "beds", header: "Beds", width: 80 },
    { key: "baths", header: "Baths", width: 90 },
    { key: "status", header: "Status", width: 120 },
    { key: "rent", header: "Market Rent", width: 140 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar title="Units" value={q} onChange={setQ} placeholder="Search units / property / status" />
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import DataTable, { Column } from "../../components/DataTable";

type PropertyRow = {
  id: string;
  name: string;
  address: string;
  units: number;
  occupancy: string; // "94%" etc
  market: string; // region/metro
};

const MOCK: PropertyRow[] = [
  { id: "P-1001", name: "Crescent Ridge Apts", address: "1221 W Cedar Ln, Austin, TX", units: 84, occupancy: "96%", market: "Austin" },
  { id: "P-1002", name: "Maple Grove", address: "77 Maple St, Denver, CO", units: 120, occupancy: "92%", market: "Denver" },
  { id: "P-1003", name: "Harbor View Homes", address: "15 Harbor Way, Tampa, FL", units: 64, occupancy: "98%", market: "Tampa" },
];

export default function Properties() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOCK;
    return MOCK.filter(r =>
      r.name.toLowerCase().includes(t) ||
      r.address.toLowerCase().includes(t) ||
      r.id.toLowerCase().includes(t) ||
      r.market.toLowerCase().includes(t)
    );
  }, [q]);

  const columns: Column<PropertyRow>[] = [
    { key: "id", header: "ID", width: 110 },
    { key: "name", header: "Property" },
    { key: "address", header: "Address" },
    { key: "units", header: "Units", width: 90 },
    { key: "occupancy", header: "Occupancy", width: 120 },
    { key: "market", header: "Market", width: 140 },
  ];

  return (
    <section className="ecc-page">
      <FilterBar title="Properties" value={q} onChange={setQ} createLabel="Add Property" onCreate={() => alert("Create Property")} />
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

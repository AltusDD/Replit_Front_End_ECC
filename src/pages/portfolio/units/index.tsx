import React, { useMemo, useState } from "react";
import { DataTable, Col } from "../../../components/DataTable";
import KPIBar from "../../../components/KPIBar";
import { UNIT_COLUMNS } from "../columns";
import { useCollection } from "../../../features/data/useCollection";
import { indexBy } from "../../../utils/dict";
import { money } from "../../../utils/format";

type Row = {
  id:any; doorloop_id?:any; property:string; unit_number:string;
  beds:number|''; baths:number|''; sq_ft:number|''; status:string; market_rent:number|undefined;
};

export default function UnitsPage() {
  const units = useCollection<any>("units");
  const props = useCollection<any>("properties");

  const [statusF, setStatusF] = useState<"ALL"|"Occupied"|"Vacant"|"Other">("ALL");
  const [minBeds, setMinBeds] = useState<number|''>('');
  const [minBaths, setMinBaths] = useState<number|''>('');

  const rawRows = useMemo<Row[]>(() => {
    const pById = indexBy(props.data, "id");
    return (units.data || []).map((u: any) => {
      const rent = typeof u.rent_cents === "number" ? u.rent_cents/100 : (u.market_rent ?? u.rent ?? u.rent_amount);
      const status = u.status ?? (u.id && u.property_id ? "" : "");
      return {
        id: u.id ?? u.doorloop_id,
        doorloop_id: u.doorloop_id,
        property: u.property ?? u.property_name ?? pById.get(u.property_id)?.name ?? "",
        unit_number: u.unit_number ?? u.number ?? u.name ?? "",
        beds: u.beds ?? u.bedrooms ?? '',
        baths: u.baths ?? u.bathrooms ?? '',
        sq_ft: u.sq_ft ?? u.sqft ?? '',
        status: status,
        market_rent: typeof rent === "number" ? rent : undefined,
      };
    });
  }, [units.data, props.data]);

  const filtered = useMemo(() => {
    return rawRows.filter(r => {
      if (statusF !== "ALL") {
        const s = (r.status || "").toLowerCase();
        const bucket = s === "occupied" ? "Occupied" : s === "vacant" ? "Vacant" : "Other";
        if (bucket !== statusF) return false;
      }
      if (minBeds !== '' && (Number(r.beds) < Number(minBeds))) return false;
      if (minBaths !== '' && (Number(r.baths) < Number(minBaths))) return false;
      return true;
    });
  }, [rawRows, statusF, minBeds, minBaths]);

  const totals = useMemo(() => {
    const total = filtered.length;
    const occ = filtered.filter(r => String(r.status).toLowerCase()==="occupied").length;
    const vac = filtered.filter(r => String(r.status).toLowerCase()==="vacant").length;
    const avgRent = (() => {
      const rents = filtered.map(r => r.market_rent).filter((x):x is number => typeof x === "number");
      if (!rents.length) return undefined;
      return rents.reduce((a,b)=>a+b,0)/rents.length;
    })();
    return { total, occ, vac, avgRent };
  }, [filtered]);

  const cols: Col<Row>[] = [
    { key: "property", header: "Property" },
    { key: "unit_number", header: "Unit" },
    { key: "beds", header: "Bd", align: "right" },
    { key: "baths", header: "Ba", align: "right" },
    { key: "sq_ft", header: "SqFt", align: "right" },
    { key: "status", header: "Status", render: (r) => <span className={`badge ${String(r.status).toLowerCase()==="occupied"?"ok":String(r.status).toLowerCase()==="vacant"?"warn":""}`}>{r.status || "—"}</span> },
    { key: "market_rent", header: "Market Rent", align: "right", render: (r)=> <span className="mono">{money(r.market_rent)}</span> },
  ];

  const filtersRight = (
    <>
      <select className="flt-select" value={statusF} onChange={(e)=>setStatusF(e.target.value as any)}>
        <option>ALL</option><option>Occupied</option><option>Vacant</option><option>Other</option>
      </select>
      <input className="flt-input" type="number" min="0" placeholder="Min Bd" value={minBeds as any}
        onChange={(e)=>setMinBeds(e.target.value===""? '' : Number(e.target.value))} style={{ width:90 }} />
      <input className="flt-input" type="number" min="0" placeholder="Min Ba" value={minBaths as any}
        onChange={(e)=>setMinBaths(e.target.value===""? '' : Number(e.target.value))} style={{ width:90 }} />
    </>
  );

  return (
    <>
      <KPIBar items={[
        { label: "Units", value: totals.total },
        { label: "Occupied", value: totals.occ, tone: "ok" },
        { label: "Vacant", value: totals.vac, tone: totals.vac ? "warn" : "ok" },
        { label: "Avg Market Rent", value: money(totals.avgRent ?? "—") },
      ]}/>
      <DataTable
        title="Units"
        columns={cols}
        rows={filtered}
        loading={units.loading}
        error={units.error ?? undefined}
        searchKeys={UNIT_COLUMNS.map(c => c.key as keyof Row & string)}
        defaultPageSize={50}
        pageSizeOptions={[25,50,100,200]}
        toolbarRight={filtersRight}
        csvFileName="units.csv"
        rowKey={(r)=>r.id}
        emptyText="No units"
      />
    </>
  );
}
import React from "react";
import { getPath, money, percent, shortDate, dash } from "../../utils/format";
import ProgressBar from "../../features/portfolio/components/ProgressBar";
import StatusTag from "../../features/portfolio/components/StatusTag";
import { DataColumn } from "../../components/DataTable";

// PROPERTIES
export type PropertyRow = {
  id: string;
  name: string;
  type: string;
  class: string;
  state: string;
  city: string;
  zip: string;
  units: number;
  occPct: number;
  active: string | boolean; // keep as-is for tag
};

export function mapProperty(src:any): PropertyRow {
  const units = Number(getPath(src,"units.total", getPath(src,"units",0))) || 0;
  const occupied = Number(getPath(src,"units.occupied", 0)) || 0;
  const occPctRaw = Number(getPath(src,"occupancyPct", NaN));
  const occPct = Number.isFinite(occPctRaw) ? occPctRaw : (units ? Math.round((occupied/units)*100) : 0);
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    name: String(getPath(src,"displayName") ?? getPath(src,"address.line1") ?? getPath(src,"name") ?? dash),
    type: String(getPath(src,"type") ?? dash),
    class: String(getPath(src,"class") ?? dash),
    state: String(getPath(src,"address.state") ?? getPath(src,"state") ?? dash),
    city: String(getPath(src,"address.city") ?? getPath(src,"city") ?? dash),
    zip: String(getPath(src,"address.zip") ?? getPath(src,"zip") ?? dash),
    units,
    occPct: Math.max(0, Math.min(100, occPct)),
    active: getPath(src,"active") ?? dash,
  };
}

export const PROPERTY_COLUMNS = [
  { key:"name",  header:"PROPERTY", filter:"text", minWidth:260, render:(r:PropertyRow)=><strong>{r.name}</strong> },
  { key:"type",  header:"TYPE", filter:"text" },
  { key:"class", header:"CLASS", filter:"text" },
  { key:"state", header:"STATE", filter:"text", width:80 },
  { key:"city",  header:"CITY", filter:"text" },
  { key:"zip",   header:"ZIP",  filter:"text", width:100 },
  { key:"units", header:"UNITS", align:"right", sort:"numeric", filter:"numberRange", width:90 },
  { key:"occPct", header:"OCCUPANCY", sort:"numeric", render:(r:PropertyRow)=><ProgressBar value={r.occPct} /> },
  { key:"active", header:"ACTIVE",
    filter:{ type:"select", options:["All","Active","Inactive"] },
    render:(r:PropertyRow)=><StatusTag value={String(r.active)} /> },
];

// UNITS
export type UnitRow = {
  id: string;
  property: string;
  unit: string;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  marketRent: number;
};

export function mapUnit(src:any): UnitRow {
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    property: String(getPath(src,"property.displayName") ?? getPath(src,"property.name") ?? dash),
    unit: String(getPath(src,"label") ?? getPath(src,"unit") ?? dash),
    beds: Number(getPath(src,"beds",0)),
    baths: Number(getPath(src,"baths",0)),
    sqft: Number(getPath(src,"sqft",0)),
    status: String(getPath(src,"status") ?? dash),
    marketRent: Number(getPath(src,"marketRent",0)),
  };
}

export const UNIT_COLUMNS = [
  { key:"property", header:"PROPERTY", filter:"text", minWidth:260 },
  { key:"unit", header:"UNIT", filter:"text", width:120 },
  { key:"beds", header:"BEDS", align:"right", sort:"numeric", filter:"numberRange", width:80 },
  { key:"baths", header:"BATHS", align:"right", sort:"numeric", filter:"numberRange", width:90 },
  { key:"sqft", header:"SQFT", align:"right", sort:"numeric", filter:"numberRange" },
  { key:"status", header:"STATUS", filter:{type:"select", options:["All","Occupied","Vacant","Make-Ready","Down"]},
    render:(r:UnitRow)=><StatusTag value={r.status} /> },
  { key:"marketRent", header:"MARKET RENT", align:"right", sort:"numeric", filter:"numberRange",
    render:(r:UnitRow)=>money(r.marketRent) },
];

// LEASES
export type LeaseRow = {
  id: string;
  property: string;
  unit: string;
  tenants: string;
  status: string;
  start: string;
  end: string;
  rent: number;
};

export function mapLease(src:any): LeaseRow {
  const names = (getPath<any[]>(src,"tenants") ?? [])
    .map(t=> String(getPath(t,"fullName") ?? getPath(t,"name") ?? "")).filter(Boolean).join(", ");
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    property: String(getPath(src,"property.displayName") ?? getPath(src,"property.name") ?? dash),
    unit: String(getPath(src,"unit.label") ?? getPath(src,"unit") ?? dash),
    tenants: names || dash,
    status: String(getPath(src,"status") ?? dash),
    start: String(getPath(src,"startDate") ?? getPath(src,"start") ?? ""),
    end: String(getPath(src,"endDate") ?? getPath(src,"end") ?? ""),
    rent: Number(getPath(src,"rent",0)),
  };
}

export const LEASE_COLUMNS = [
  { key:"property", header:"PROPERTY", filter:"text", minWidth:260 },
  { key:"unit", header:"UNIT", filter:"text", width:120 },
  { key:"tenants", header:"TENANT(S)", filter:"text", minWidth:220, render:(r:LeaseRow)=><strong>{r.tenants}</strong> },
  { key:"status", header:"STATUS", filter:{type:"select", options:["All","active","ended","pending"]},
    render:(r:LeaseRow)=><StatusTag value={r.status} /> },
  { key:"start", header:"START", sort:"text", render:(r:LeaseRow)=>shortDate(r.start) },
  { key:"end", header:"END", sort:"text", render:(r:LeaseRow)=>shortDate(r.end) },
  { key:"rent", header:"RENT", align:"right", sort:"numeric", filter:"numberRange", render:(r:LeaseRow)=>money(r.rent) },
];

// TENANTS
export type TenantRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  type: string; // primary | secondary | prospect
  balance: number;
};

export function mapTenant(src:any): TenantRow {
  const type =
    (getPath(src,"type") ?? getPath(src,"role") ?? "").toString().toLowerCase()
    || (!getPath(src,"leaseId") ? "prospect" : "primary");
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    name: String(getPath(src,"fullName") ?? getPath(src,"name") ?? dash),
    email: String(getPath(src,"email") ?? dash),
    phone: String(getPath(src,"phone") ?? getPath(src,"phoneNumber") ?? dash),
    property: String(getPath(src,"property.displayName") ?? getPath(src,"property.name") ?? dash),
    unit: String(getPath(src,"unit.label") ?? getPath(src,"unit") ?? dash),
    type,
    balance: Number(getPath(src,"balance",0)),
  };
}

export const TENANT_COLUMNS = [
  { key:"name", header:"TENANT", filter:"text", minWidth:200 },
  { key:"email", header:"EMAIL", filter:"text" },
  { key:"phone", header:"PHONE", filter:"text" },
  { key:"property", header:"PROPERTY", filter:"text", minWidth:220 },
  { key:"unit", header:"UNIT", filter:"text", width:120 },
  { key:"type", header:"TYPE", filter:{type:"select", options:["All","primary","secondary","prospect"]},
    render:(r:TenantRow)=><StatusTag value={r.type} /> },
  { key:"balance", header:"BALANCE", align:"right", sort:"numeric", filter:"numberRange",
    render:(r:TenantRow)=>money(r.balance) },
];

// OWNERS
export type OwnerRow = {
  id: string;
  company: string;
  email: string;
  phone: string;
  active: string | boolean;
};

export function mapOwner(src:any): OwnerRow {
  const company = String(
    getPath(src,"company") ??
    getPath(src,"companyName") ??
    getPath(src,"name") ??
    getPath(src,"ownerName") ??
    dash
  );
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    company,
    email: String(getPath(src,"email") ?? dash),
    phone: String(getPath(src,"phone") ?? getPath(src,"phoneNumber") ?? dash),
    active: getPath(src,"active") ?? dash,
  };
}

export const OWNER_COLUMNS = [
  { key:"company", header:"COMPANY", filter:"text", minWidth:200 },
  { key:"email", header:"EMAIL", filter:"text" },
  { key:"phone", header:"PHONE", filter:"text" },
  { key:"active", header:"ACTIVE",
    filter:{ type:"select", options:["All","Active","Inactive"] },
    render:(r:OwnerRow)=><StatusTag value={String(r.active)} /> },
];
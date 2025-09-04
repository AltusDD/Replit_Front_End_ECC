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
    zip: String(
      getPath(src, "address_zip") ??
      getPath(src, "address.zipCode") ??
      getPath(src, "zipcode") ??
      getPath(src, "postal_code") ??
      getPath(src, "address.zip") ??
      getPath(src, "zip") ??
      dash
    ),
    units,
    occPct: Math.max(0, Math.min(100, occPct)),
    active: getPath(src,"active") ?? dash,
  };
}

export const PROPERTY_COLUMNS = [
  { key:"name",  header:"PROPERTY", type:"text", render:(value:any, r:PropertyRow)=><strong>{r.name}</strong> },
  { key:"type",  header:"TYPE", type:"text" },
  { key:"class", header:"CLASS", type:"text" },
  { key:"state", header:"STATE", type:"text" },
  { key:"city",  header:"CITY", type:"text" },
  { key:"zip",   header:"ZIP", type:"text" },
  { key:"units", header:"UNITS", align:"right", type:"number" },
  { key:"occPct", header:"OCCUPANCY", type:"number", render:(value:any, r:PropertyRow)=><ProgressBar value={r.occPct} /> },
  { key:"active", header:"ACTIVE", type:"enum", render:(value:any, r:PropertyRow)=><StatusTag value={String(r.active)} /> },
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
  const property = getPath(src,"property.name") ?? getPath(src,"property.displayName") ?? getPath(src,"property") ?? dash;
  const unit = getPath(src,"unit_number") ?? getPath(src,"label") ?? getPath(src,"unit.label") ?? getPath(src,"number") ?? getPath(src,"name") ?? dash;
  const beds = Number(getPath(src,"beds") ?? getPath(src,"bedrooms") ?? 0);
  const baths = Number(getPath(src,"baths") ?? getPath(src,"bathrooms") ?? 0);
  const sqft = Number(getPath(src,"sq_ft") ?? getPath(src,"squareFeet") ?? getPath(src,"square_feet") ?? getPath(src,"sqft") ?? 0);
  
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    property: String(property),
    unit: String(unit),
    beds,
    baths,
    sqft,
    status: String(getPath(src,"status") ?? dash),
    marketRent: Number(getPath(src,"rent_amount") ?? getPath(src,"marketRent") ?? 0),
  };
}

export const UNIT_COLUMNS = [
  { key:"property", header:"PROPERTY", type:"text" },
  { key:"unit", header:"UNIT", type:"text" },
  { key:"beds", header:"BEDS", align:"right", type:"number" },
  { key:"baths", header:"BATHS", align:"right", type:"number" },
  { key:"sqft", header:"SQFT", align:"right", type:"number" },
  { key:"status", header:"STATUS", type:"enum", render:(value:any, r:UnitRow)=><StatusTag value={r.status} /> },
  { key:"marketRent", header:"MARKET RENT", align:"right", type:"number", render:(value:any, r:UnitRow)=>money(r.marketRent) },
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
  const tenantsList = getPath<any[]>(src,"tenants") ?? [];
  const names = Array.isArray(tenantsList) 
    ? tenantsList.map(t => typeof t === 'string' ? t : String(getPath(t,"fullName") ?? getPath(t,"name") ?? "")).filter(Boolean).join(", ")
    : "";
  
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    property: String(getPath(src,"property.name") ?? getPath(src,"property.displayName") ?? dash),
    unit: String(getPath(src,"unit.label") ?? getPath(src,"unit.unit_number") ?? getPath(src,"unit.number") ?? getPath(src,"unit.name") ?? dash),
    tenants: names || dash,
    status: String(getPath(src,"status") ?? dash),
    start: String(getPath(src,"start_date") ?? getPath(src,"startDate") ?? getPath(src,"start") ?? ""),
    end: String(getPath(src,"end_date") ?? getPath(src,"endDate") ?? getPath(src,"end") ?? ""),
    rent: Number(getPath(src,"rent_cents",0) ?? getPath(src,"rent",0)),
  };
}

export const LEASE_COLUMNS = [
  { key:"property", header:"PROPERTY", type:"text" },
  { key:"unit", header:"UNIT", type:"text" },
  { key:"tenants", header:"TENANT(S)", type:"text", render:(value:any, r:LeaseRow)=><strong>{r.tenants}</strong> },
  { key:"status", header:"STATUS", type:"enum", render:(value:any, r:LeaseRow)=><StatusTag value={r.status} /> },
  { key:"start", header:"START", type:"date", render:(value:any, r:LeaseRow)=>shortDate(r.start) },
  { key:"end", header:"END", type:"date", render:(value:any, r:LeaseRow)=>shortDate(r.end) },
  { key:"rent", header:"RENT", align:"right", type:"number", render:(value:any, r:LeaseRow)=>money(r.rent) },
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
  const email = getPath(src,"email") ?? getPath(src,"primary_email") ?? getPath(src,"contact_email") ?? getPath(src,"profile.email") ?? getPath(src,"contacts[0].email") ?? dash;
  const phone = getPath(src,"phone") ?? getPath(src,"phone_number") ?? getPath(src,"phoneNumber") ?? getPath(src,"mobile") ?? getPath(src,"cell") ?? getPath(src,"contacts[0].phone") ?? getPath(src,"phones[0].number") ?? dash;
  
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    name: String(getPath(src,"full_name") ?? getPath(src,"display_name") ?? getPath(src,"fullName") ?? getPath(src,"name") ?? dash),
    email: String(email),
    phone: String(phone),
    property: String(getPath(src,"property.name") ?? getPath(src,"property.displayName") ?? dash),
    unit: String(getPath(src,"unit.label") ?? getPath(src,"unit") ?? dash),
    type,
    balance: Number(getPath(src,"balance",0)),
  };
}

export const TENANT_COLUMNS = [
  { key:"name", header:"TENANT", type:"text" },
  { key:"email", header:"EMAIL", type:"text" },
  { key:"phone", header:"PHONE", type:"text" },
  { key:"property", header:"PROPERTY", type:"text" },
  { key:"unit", header:"UNIT", type:"text" },
  { key:"type", header:"TYPE", type:"enum", render:(value:any, r:TenantRow)=><StatusTag value={r.type} /> },
  { key:"balance", header:"BALANCE", align:"right", type:"number", render:(value:any, r:TenantRow)=>money(r.balance) },
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
  const company = getPath(src,"company_name") ?? getPath(src,"companyName") ?? getPath(src,"company") ?? getPath(src,"businessName") ?? getPath(src,"organization") ?? getPath(src,"name") ?? getPath(src,"ownerName") ?? getPath(src,"display_name") ?? dash;
  const email = getPath(src,"email") ?? getPath(src,"primary_email") ?? getPath(src,"contact_email") ?? getPath(src,"owner_email") ?? getPath(src,"emails[0].address") ?? getPath(src,"contacts[0].email") ?? dash;
  const phone = getPath(src,"phone") ?? getPath(src,"phone_number") ?? getPath(src,"phoneNumber") ?? getPath(src,"primary_phone") ?? getPath(src,"mobile") ?? getPath(src,"phones[0].number") ?? getPath(src,"contacts[0].phone") ?? dash;
  const active = getPath(src,"active") ?? getPath(src,"is_active") ?? getPath(src,"status") ?? null;
  
  return {
    id: String(getPath(src,"id") ?? getPath(src,"_id")),
    company: String(company),
    email: String(email),
    phone: String(phone),
    active,
  };
}

export const OWNER_COLUMNS = [
  { key:"company", header:"COMPANY", type:"text", render:(_v: any, r: any) => <strong>{r.company ?? ""}</strong> },
  { key:"email", header:"EMAIL", type:"text" },
  { key:"phone", header:"PHONE", type:"text" },
  { key:"active", header:"ACTIVE", type:"enum", render:(value:any, r:OwnerRow)=><StatusTag value={String(r.active)} /> },
];
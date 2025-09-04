import React from "react";
import { money, percent, shortDate, dash } from "../../utils/format";
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
  // Backend now provides clean, structured data - minimal mapping needed
  return {
    id: String(src.id),
    name: src.name || "—",
    type: src.type || "—",
    class: src.class || "—",
    state: src.state || "—",
    city: src.city || "—",
    zip: src.zip || "—",
    units: src.units || 0,
    occPct: src.occPct || 0,
    active: src.active ?? false,
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
  // Backend provides structured data - use it directly  
  return {
    id: String(src.id),
    property: src.propertyName || src.property?.name || "—",
    unit: src.unitLabel || src.unit_number || src.label || "—",
    beds: src.beds || 0,
    baths: src.baths || 0, 
    sqft: src.sqft || src.sq_ft || 0,
    status: src.status || "—",
    marketRent: src.marketRent || src.rent_amount || 0,
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
  // Backend now provides clean, structured data
  const tenants = Array.isArray(src.tenants) ? src.tenants.join(", ") : "—";
  
  return {
    id: String(src.id),
    property: src.propertyName || "—",
    unit: src.unitLabel || "—", 
    tenants,
    status: src.status || "—",
    start: src.start || "",
    end: src.end || "",
    rent: src.rent || 0,
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
  // Backend provides structured data - use it directly
  return {
    id: String(src.id),
    name: src.name || "—",
    email: src.email || "—", 
    phone: src.phone || "—",
    property: src.propertyName || src.property?.name || "—",
    unit: src.unitLabel || src.unit?.label || "—",
    type: src.type || "PROSPECT_TENANT",
    balance: src.balance || 0,
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
  name: string;
  email: string;
  phone: string;
  active: string | boolean;
};

export function mapOwner(src:any): OwnerRow {
  // Backend provides structured data - use it directly
  return {
    id: String(src.id),
    company: src.company || src.company_name || "—",
    name: src.name || src.display_name || src.full_name || "—",
    email: src.email || src.primary_email || src.contact_email || "—",
    phone: src.phone || src.phone_number || src.primary_phone || "—", 
    active: src.active,
  };
}

export const OWNER_COLUMNS = [
  { key:"company", header:"COMPANY", type:"text", render:(_v: any, r: any) => <strong>{r.company ?? ""}</strong> },
  { key:"name", header:"OWNER", type:"text" },
  { key:"email", header:"EMAIL", type:"text" },
  { key:"phone", header:"PHONE", type:"text" },
  { key:"active", header:"ACTIVE", type:"enum", render:(value:any, r:OwnerRow)=><StatusTag value={String(r.active)} /> },
];
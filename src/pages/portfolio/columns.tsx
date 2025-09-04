import React from "react";
import { money, percent, shortDate, boolBadge, progressBar, statusBadge as genesisStatusBadge } from "../../utils/format";
import { DataColumn } from "../../components/DataTable";

// Type alias for requirement compatibility
export type ColumnDef = DataColumn;

// Helper utilities for robust data mapping
const get = (o: any, ...paths: string[]) => {
  for (const p of paths) {
    const v = p.split(".").reduce((x, k) => (x ? x[k] : undefined), o);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const coerceInt = (v: any) => Number.isFinite(+v) ? +v : 0;
const coercePct = (v: any) => {
  if (v == null) return 0;
  const n = +v;
  return n > 1 ? n : Math.round(n * 100);
};

// PROPERTY COLUMNS & MAPPER
export const PROPERTY_COLUMNS: ColumnDef[] = [
  { key: "property", header: "PROPERTY", type: "text" },
  { key: "type", header: "TYPE", type: "enum" },
  { key: "class", header: "CLASS", type: "enum" },
  { key: "state", header: "STATE", type: "enum" },
  { key: "city", header: "CITY", type: "text" },
  { key: "zip", header: "ZIP", type: "text" },
  { key: "units", header: "UNITS", align: "right", type: "number" },
  { 
    key: "occ", 
    header: "OCCUPANCY", 
    align: "right", 
    type: "number",
    render: (value, row) => progressBar(row.occ || 0, 100)
  },
  { 
    key: "active", 
    header: "ACTIVE", 
    type: "enum",
    render: (value, row) => boolBadge(row.active, "Active", "Inactive")
  }
];

export function mapProperty(d: any) {
  return {
    id: get(d, "id", "uid", "_id"),
    property: get(d, "name", "displayName", "address.line1", "address1", "fullAddress") || "—",
    type: get(d, "type") || "—",
    class: get(d, "class") || "—",
    state: get(d, "address.state", "addr.state", "state") || "—",
    city: get(d, "address.city", "addr.city", "city") || "—",
    zip: get(d, "address.zip", "addr.zip", "postal_code", "zip") || "—",
    units: coerceInt(get(d, "units", "units_count", "unitCount")),
    occ: coercePct(get(d, "occupancy", "occupancy_percent", "occPct")),
    active: !!get(d, "active", "isActive", "status.active")
  };
}

// UNIT COLUMNS & MAPPER
export const UNIT_COLUMNS: ColumnDef[] = [
  { key: "property", header: "PROPERTY", type: "text" },
  { key: "unit", header: "UNIT", type: "text" },
  { key: "bd", header: "BEDS", align: "right", type: "number" },
  { key: "ba", header: "BATHS", align: "right", type: "number" },
  { key: "sqft", header: "SQFT", align: "right", type: "number" },
  { key: "status", header: "STATUS", type: "enum", render: (value, row) => boolBadge(value === "Occupied", "Occupied", value || "Vacant") },
  { 
    key: "market_rent", 
    header: "MARKET RENT", 
    align: "right", 
    type: "number",
    render: (value, row) => money(row.market_rent)
  }
];

export function mapUnit(d: any) {
  return {
    id: get(d, "id", "uid", "_id"),
    property: get(d, "property.name", "propertyAddress", "property.address.line1", "property.address1") || "—",
    unit: get(d, "unit", "unit_label", "address.line1", "unitAddress") || "—",
    bd: coerceInt(get(d, "beds", "bd")),
    ba: +get(d, "baths", "ba") || 0,
    sqft: coerceInt(get(d, "sqft", "square_feet")),
    status: get(d, "status", "occupancy_status") || "—",
    market_rent: +get(d, "market_rent", "rent.market", "asking_rent") || 0
  };
}

// LEASE COLUMNS & MAPPER
export const LEASE_COLUMNS: ColumnDef[] = [
  { key: "tenant", header: "TENANT(S)", type: "text" },
  { key: "property", header: "PROPERTY", type: "text" },
  { key: "unit", header: "UNIT", type: "text" },
  { key: "status", header: "STATUS", type: "enum", render: (value, row) => boolBadge(value === "active", value || "—", value || "—") },
  { key: "start", header: "START", type: "date", render: (value, row) => shortDate(row.start) },
  { key: "end", header: "END", type: "date", render: (value, row) => shortDate(row.end) },
  { 
    key: "rent", 
    header: "RENT", 
    align: "right", 
    type: "number",
    render: (value, row) => money(row.rent)
  }
];

export function mapLease(d: any) {
  const tenants = get(d, "tenants") || get(d, "household.members") || [];
  const primary = Array.isArray(tenants) && tenants.length ? (tenants[0].name || tenants[0].fullName || tenants[0].firstName && tenants[0].lastName ? `${tenants[0].firstName} ${tenants[0].lastName}`.trim() : tenants[0]) : get(d, "tenant.name", "tenant");
  const extra = Array.isArray(tenants) && tenants.length > 1 ? ` +${tenants.length-1}` : "";
  
  return {
    id: get(d, "id", "uid", "_id"),
    tenant: (primary || "—") + extra,
    property: get(d, "property.name", "propertyAddress", "unit.property.name") || "—",
    unit: get(d, "unit.label", "unit", "unitAddress") || "—",
    status: get(d, "status") || "—",
    start: get(d, "start", "start_date", "dates.start"),
    end: get(d, "end", "end_date", "dates.end"),
    rent: +get(d, "rent", "monthly_rent") || 0
  };
}

// TENANT COLUMNS & MAPPER
export const TENANT_COLUMNS: ColumnDef[] = [
  { key: "tenant", header: "TENANT", type: "text" },
  { key: "email", header: "EMAIL", type: "text" },
  { key: "phone", header: "PHONE", type: "text" },
  { key: "property", header: "PROPERTY", type: "text" },
  { key: "unit", header: "UNIT", type: "text" },
  { key: "type", header: "TYPE", type: "enum", render: (value, row) => boolBadge(value === "Lease_Tenant", value || "—", value || "—") },
  { 
    key: "balance", 
    header: "BALANCE", 
    align: "right", 
    type: "number",
    render: (value, row) => {
      const balance = row.balance || 0;
      const color = balance > 0 ? "warn" : "ok";
      return <span className={`ecc-badge ecc-badge--${color}`}>{money(balance)}</span>;
    }
  }
];

export function mapTenant(d: any) {
  const type = get(d, "type") || (get(d, "leaseId", "lease.id") ? "Lease_Tenant" : (get(d, "status") === "prospect" ? "Prospect" : "Lease_Tenant"));
  const hh = coerceInt(get(d, "householdSize", "members_count"));
  const extra = hh > 1 ? ` +${hh-1}` : "";
  
  return {
    id: get(d, "id", "uid", "_id"),
    tenant: (get(d, "name", "fullName", "firstName") || "—") + extra,
    email: get(d, "email") || "—",
    phone: get(d, "phone", "phone_number") || "—",
    property: get(d, "property.name", "propertyAddress") || "—",
    unit: get(d, "unit.label", "unit", "unitAddress") || "—",
    type,
    balance: +get(d, "balance", "ledger.balance", "account.balance") || 0
  };
}

// OWNER COLUMNS & MAPPER
export const OWNER_COLUMNS: ColumnDef[] = [
  { key: "owner", header: "OWNER", type: "text" },
  { key: "email", header: "EMAIL", type: "text" },
  { key: "phone", header: "PHONE", type: "text" },
  { key: "properties", header: "PROPERTIES", align: "right", type: "number" },
  { 
    key: "active", 
    header: "ACTIVE", 
    type: "enum",
    render: (value, row) => boolBadge(row.active, "Active", "Inactive")
  }
];

export function mapOwner(d: any) {
  return {
    id: get(d, "id", "uid", "_id"),
    owner: get(d, "company", "name", "displayName") || "—",
    email: get(d, "email") || "—",
    phone: get(d, "phone") || "—",
    properties: coerceInt(get(d, "properties_count", "propertyCount", "stats.properties")),
    active: !!get(d, "active", "isActive")
  };
}
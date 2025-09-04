import React from "react";
import { money, percent, shortDate, boolBadge } from "../../utils/format";
import { DataColumn } from "../../components/DataTable";

// Badge helper for status/boolean displays
function statusBadge(text: string, isActive: boolean) {
  const className = isActive ? "ecc-badge ecc-badge--ok" : "ecc-badge ecc-badge--bad";
  return <span className={className}>{text}</span>;
}

// PROPERTY COLUMNS & MAPPER
export const PROPERTY_COLUMNS: DataColumn[] = [
  { key: "name", header: "PROPERTY", type: "text" },
  { key: "type", header: "TYPE", type: "enum" },
  { key: "class", header: "CLASS", type: "enum" },
  { key: "state", header: "STATE", type: "enum" },
  { key: "city", header: "CITY", type: "text" },
  { key: "unit_count", header: "UNITS", align: "right", type: "number" },
  { 
    key: "occupancy", 
    header: "OCCUPANCY", 
    align: "right", 
    type: "number",
    render: (value, row) => {
      const occ = row.occupancy || 0;
      const color = occ >= 90 ? "ok" : occ >= 70 ? "warn" : "bad";
      return <span className={`ecc-badge ecc-badge--${color}`}>{percent(occ, 1)}</span>;
    }
  },
  { 
    key: "active", 
    header: "ACTIVE", 
    type: "enum",
    render: (value, row) => statusBadge(row.active ? "Active" : "Inactive", row.active)
  }
];

export function mapProperty(raw: any, enrichment: any = {}) {
  return {
    id: raw.id,
    name: raw.name || raw.property_name || `${raw.address_line1 || ""} ${raw.address_city || ""}`.trim() || "—",
    type: raw.property_type || raw.type || "—",
    class: raw.property_class || raw.class || "—",
    state: enrichment.state || raw.address_state || raw.state || "—",
    city: enrichment.city || raw.address_city || raw.city || "—",
    unit_count: enrichment.units || raw.unit_count || 0,
    occupancy: enrichment.occ || raw.occupancy || 0,
    active: raw.active !== false
  };
}

// UNIT COLUMNS & MAPPER
export const UNIT_COLUMNS: DataColumn[] = [
  { key: "property_name", header: "PROPERTY", type: "text" },
  { key: "unit_number", header: "UNIT", type: "text" },
  { key: "beds", header: "BEDS", align: "right", type: "number" },
  { key: "baths", header: "BATHS", align: "right", type: "number" },
  { key: "sqft", header: "SQFT", align: "right", type: "number" },
  { key: "status", header: "STATUS", type: "enum" },
  { 
    key: "market_rent", 
    header: "MARKET RENT", 
    align: "right", 
    type: "number",
    render: (value, row) => money(row.market_rent)
  }
];

export function mapUnit(raw: any, propertyName: string = "—", occupied: boolean = false) {
  return {
    id: raw.id,
    property_name: propertyName,
    unit_number: raw.unit_number || raw.unit || "—",
    beds: raw.bedrooms || raw.beds || 0,
    baths: raw.bathrooms || raw.baths || 0,
    sqft: raw.square_feet || raw.sqft || 0,
    status: occupied ? "Occupied" : (raw.status || "Vacant"),
    market_rent: raw.market_rent || raw.rent || 0
  };
}

// LEASE COLUMNS & MAPPER
export const LEASE_COLUMNS: DataColumn[] = [
  { key: "property_name", header: "PROPERTY", type: "text" },
  { key: "unit_number", header: "UNIT", type: "text" },
  { key: "tenant_name", header: "TENANT", type: "text" },
  { key: "status", header: "STATUS", type: "enum" },
  { key: "start_date", header: "START DATE", type: "date", render: (value, row) => shortDate(row.start_date) },
  { key: "end_date", header: "END DATE", type: "date", render: (value, row) => shortDate(row.end_date) },
  { 
    key: "rent", 
    header: "RENT", 
    align: "right", 
    type: "number",
    render: (value, row) => money(row.rent)
  }
];

export function mapLease(raw: any, propertyName: string = "—", tenantName: string = "—") {
  return {
    id: raw.id,
    property_name: propertyName,
    unit_number: raw.unit_number || "—",
    tenant_name: tenantName || "—",
    status: raw.status || "Unknown",
    start_date: raw.start_date || raw.lease_start,
    end_date: raw.end_date || raw.lease_end,
    rent: raw.rent || raw.monthly_rent || 0
  };
}

// TENANT COLUMNS & MAPPER
export const TENANT_COLUMNS: DataColumn[] = [
  { key: "display_name", header: "TENANT", type: "text" },
  { key: "email", header: "EMAIL", type: "text" },
  { key: "phone", header: "PHONE", type: "text" },
  { key: "property_name", header: "PROPERTY", type: "text" },
  { key: "unit_label", header: "UNIT", type: "text" },
  { key: "status", header: "STATUS", type: "enum" },
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

export function mapTenant(raw: any, propertyName: string = "—", unitLabel: string = "—") {
  return {
    id: raw.id,
    display_name: raw.display_name || raw.full_name || `${raw.first_name || ""} ${raw.last_name || ""}`.trim() || "—",
    email: raw.email || "—",
    phone: raw.phone || raw.phone_number || "—",
    property_name: propertyName,
    unit_label: unitLabel,
    status: raw.status || "Unknown",
    balance: raw.balance || raw.account_balance || 0
  };
}

// OWNER COLUMNS & MAPPER
export const OWNER_COLUMNS: DataColumn[] = [
  { key: "name", header: "OWNER", type: "text" },
  { key: "email", header: "EMAIL", type: "text" },
  { key: "phone", header: "PHONE", type: "text" },
  { key: "property_count", header: "PROPERTIES", align: "right", type: "number" },
  { 
    key: "active", 
    header: "ACTIVE", 
    type: "enum",
    render: (value, row) => statusBadge(row.active ? "Active" : "Inactive", row.active)
  }
];

export function mapOwner(raw: any, propertyCount: number = 0) {
  return {
    id: raw.id,
    name: raw.name || raw.full_name || `${raw.first_name || ""} ${raw.last_name || ""}`.trim() || "—",
    email: raw.email || "—",
    phone: raw.phone || raw.phone_number || "—",
    property_count: propertyCount,
    active: raw.active !== false
  };
}
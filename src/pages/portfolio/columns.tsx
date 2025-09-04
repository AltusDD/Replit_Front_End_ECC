import React from "react";
import { money, percent, shortDate, boolBadge, progressBar, statusBadge, rowActions } from "../../utils/format";
import { DataColumn } from "../../components/DataTable";

// Helper for portfolio entity row actions
function getPropertyActions(property: any) {
  return [
    { label: "View Details", onClick: () => console.log("View property:", property.name) },
    { label: "View Units", onClick: () => console.log("View units for:", property.name) },
    { label: "View Leases", onClick: () => console.log("View leases for:", property.name) },
    { label: "Edit Property", onClick: () => console.log("Edit property:", property.name) },
    { label: "Generate Report", onClick: () => console.log("Generate report for:", property.name) },
  ];
}

function getUnitActions(unit: any) {
  return [
    { label: "View Details", onClick: () => console.log("View unit:", unit.unit_number) },
    { label: "View Lease", onClick: () => console.log("View lease for:", unit.unit_number) },
    { label: "Schedule Tour", onClick: () => console.log("Schedule tour:", unit.unit_number) },
    { label: "Edit Unit", onClick: () => console.log("Edit unit:", unit.unit_number) },
  ];
}

function getLeaseActions(lease: any) {
  return [
    { label: "View Details", onClick: () => console.log("View lease:", lease.id) },
    { label: "View Tenant", onClick: () => console.log("View tenant:", lease.tenant_name) },
    { label: "Renew Lease", onClick: () => console.log("Renew lease:", lease.id) },
    { label: "Edit Lease", onClick: () => console.log("Edit lease:", lease.id) },
  ];
}

function getTenantActions(tenant: any) {
  return [
    { label: "View Details", onClick: () => console.log("View tenant:", tenant.display_name) },
    { label: "View Lease", onClick: () => console.log("View lease for:", tenant.display_name) },
    { label: "Send Message", onClick: () => console.log("Message tenant:", tenant.display_name) },
    { label: "Edit Tenant", onClick: () => console.log("Edit tenant:", tenant.display_name) },
  ];
}

function getOwnerActions(owner: any) {
  return [
    { label: "View Details", onClick: () => console.log("View owner:", owner.name) },
    { label: "View Properties", onClick: () => console.log("View properties for:", owner.name) },
    { label: "Generate Report", onClick: () => console.log("Generate report for:", owner.name) },
    { label: "Edit Owner", onClick: () => console.log("Edit owner:", owner.name) },
  ];
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
    render: (value, row) => progressBar(row.occupancy || 0, 100)
  },
  { 
    key: "active", 
    header: "ACTIVE", 
    type: "enum",
    render: (value, row) => statusBadge(row.active ? "Active" : "Inactive", row.active)
  },
  {
    key: "actions",
    header: "",
    render: (value, row) => rowActions(getPropertyActions(row))
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
  },
  {
    key: "actions",
    header: "",
    render: (value, row) => rowActions(getLeaseActions(row))
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
  },
  {
    key: "actions",
    header: "",
    render: (value, row) => rowActions(getTenantActions(row))
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
  },
  {
    key: "actions",
    header: "",
    render: (value, row) => rowActions(getOwnerActions(row))
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
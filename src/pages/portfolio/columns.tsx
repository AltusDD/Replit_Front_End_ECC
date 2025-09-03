// src/pages/portfolio/columns.tsx
import React from "react";
import { money, percent, shortDate, boolText, badge } from "../../utils/format";
import type { Column } from "../../components/DataTable";

// ── Entity types (shape is tolerant to your live schema) ─────────────
export type Property = {
  id: string | number;
  name?: string;
  type?: string;
  class?: string;
  address_city?: string;
  address_state?: string;
  unit_count?: number;
  occupancy_rate?: number; // optional from DB
  active?: boolean;
};

export type Unit = {
  id: string | number;
  property_id?: string | number;
  unit_number?: string;
  beds?: number;
  baths?: number;
  sq_ft?: number;
  status?: string;
  rent_amount?: number;
};

export type Lease = {
  id: string | number;
  property_id?: string | number;
  unit_id?: string | number;
  rent_cents?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  tenant_names?: string; // optional if server computed
  doorloop_id?: string | number;
  primary_tenant_id?: string | number;
  tenant_id?: string | number;
};

export type Tenant = {
  id: string | number;
  display_name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  type?: string; // active / PROSPECT_TENANT etc
};

export type Owner = {
  id: string | number;
  display_name?: string;
  company_name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  active?: boolean;
};

// ── Columns (display only) ───────────────────────────────────────────
export const PROPERTY_COLUMNS: Column<any>[] = [
  { key: "name", header: "PROPERTY" },
  { key: "type", header: "TYPE" },
  { key: "class", header: "CLASS" },
  { key: "state", header: "STATE" },
  { key: "city", header: "CITY" },
  { key: "unit_count", header: "UNITS", sort: (a, b) => (a.unit_count || 0) - (b.unit_count || 0) },
  {
    key: "occupancy",
    header: "OCC%",
    render: (r) => percent(r.occupancy),
    sort: (a, b) => (a.occupancy || 0) - (b.occupancy || 0),
  },
  {
    key: "active",
    header: "ACTIVE",
    render: (r) => badge(r.active ? "ok" : "bad", boolText(r.active)),
  },
];

export const UNIT_COLUMNS: Column<any>[] = [
  { key: "property", header: "PROPERTY" },
  { key: "unit_label", header: "UNIT" },
  { key: "beds", header: "BD", sort: (a, b) => (a.beds || 0) - (b.beds || 0) },
  { key: "baths", header: "BA", sort: (a, b) => (a.baths || 0) - (b.baths || 0) },
  { key: "sq_ft", header: "SQFT", sort: (a, b) => (a.sq_ft || 0) - (b.sq_ft || 0) },
  { key: "status", header: "STATUS" },
  { key: "rent", header: "MARKET RENT", render: (r) => money(r.rent), sort: (a, b) => (a.rent || 0) - (b.rent || 0) },
];

export const LEASE_COLUMNS: Column<any>[] = [
  { key: "tenant_names", header: "TENANT(S)" },
  { key: "property", header: "PROPERTY" },
  { key: "rent", header: "RENT", render: (r) => money(r.rent), sort: (a, b) => (a.rent || 0) - (b.rent || 0) },
  { key: "start", header: "START", render: (r) => shortDate(r.start), sort: (a, b) => String(a.start).localeCompare(String(b.start)) },
  { key: "end", header: "END", render: (r) => shortDate(r.end), sort: (a, b) => String(a.end).localeCompare(String(b.end)) },
  { key: "status", header: "STATUS" },
];

export const TENANT_COLUMNS: Column<any>[] = [
  { key: "name", header: "NAME" },
  { key: "property", header: "PROPERTY" },
  { key: "unit", header: "UNIT" },
  { key: "email", header: "EMAIL" },
  { key: "phone", header: "PHONE" },
  { key: "status", header: "STATUS" },
  { key: "balance", header: "BALANCE", render: (r) => money(r.balance), sort: (a, b) => (a.balance || 0) - (b.balance || 0) },
];

export const OWNER_COLUMNS: Column<any>[] = [
  { key: "name", header: "OWNER" },
  { key: "email", header: "EMAIL" },
  { key: "phone", header: "PHONE" },
  { key: "property_count", header: "PROPS", sort: (a, b) => (a.property_count || 0) - (b.property_count || 0) },
  { key: "active", header: "ACTIVE", render: (r) => badge(r.active ? "ok" : "bad", boolText(r.active)) },
];

// ── Client-side mappers (fills missing fields) ───────────────────────
export function mapProperty(p: any, join: { city?: string; state?: string; units?: number; occ?: number }) {
  return {
    id: p.id,
    name: p.name ?? "—",
    type: p.type ?? "—",
    class: p.class ?? "—",
    city: p.address_city ?? join.city ?? "—",
    state: p.address_state ?? join.state ?? "—",
    unit_count: p.unit_count ?? join.units ?? 0,
    occupancy: typeof p.occupancy_rate === "number" ? p.occupancy_rate : (join.occ ?? 0),
    active: !!p.active,
  };
}

export function mapUnit(u: any, propName: string, hasActiveLease: boolean) {
  return {
    id: u.id,
    property: propName,
    unit_label: u.unit_number || "—",
    beds: u.beds ?? null,
    baths: u.baths ?? null,
    sq_ft: u.sq_ft ?? null,
    status: u.status ?? (hasActiveLease ? "occupied" : "vacant"),
    rent: u.rent_amount ?? null,
  };
}

export function mapLease(l: any, propName: string, tenantName: string) {
  return {
    id: l.id,
    tenant_names: l.tenant_names || tenantName || "—",
    property: propName || "—",
    rent: typeof l.rent_cents === "number" ? l.rent_cents / 100 : l.rent_amount ?? null,
    start: l.start_date,
    end: l.end_date,
    status: l.status ?? "—",
  };
}

export function mapTenant(t: any, propName: string, unitLabel: string) {
  const name = t.display_name || t.full_name || [t.first_name, t.last_name].filter(Boolean).join(" ");
  return {
    id: t.id,
    name: name || "—",
    property: propName || "—",
    unit: unitLabel || "—",
    email: t.email || "—",
    phone: t.phone || "—",
    status: t.type || "—",
    balance: 0,
  };
}

export function mapOwner(o: any, propertyCount = 0) {
  const name =
    o.display_name ||
    o.company_name ||
    o.full_name ||
    [o.first_name, o.last_name].filter(Boolean).join(" ");
  return {
    id: o.id,
    name: name || "—",
    email: o.email || "—",
    phone: o.phone || "—",
    property_count: propertyCount,
    active: !!o.active,
  };
}

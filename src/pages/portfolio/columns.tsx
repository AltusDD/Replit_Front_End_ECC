import React from "react";
import { money, percent, shortDate, boolBadge as boolText, badge } from "../../utils/format";
import type { Column } from "../../components/DataTable";

/** Property table */
export type PropertyRow = {
  property?: string;               // display name/address
  type?: string;
  class?: string;
  state?: string;
  city?: string;
  unit_count?: number;
  occupancy?: number;              // 0..100
  active?: boolean;
};

export const PROPERTY_COLUMNS = [
  { key: "property", header: "PROPERTY", filter: "text", sort: "string" },
  { key: "type", header: "TYPE", filter: "select", sort: "string" },
  { key: "class", header: "CLASS", filter: "select", sort: "string" },
  { key: "state", header: "STATE", filter: "select", sort: "string", align: "center" as const },
  { key: "city", header: "CITY", filter: "text", sort: "string" },
  { key: "unit_count", header: "UNITS", align: "right" as const, sort: "numeric", filter: "numberRange" },
  {
    key: "occupancy",
    header: "OCC%",
    align: "right" as const,
    sort: "numeric",
    filter: "numberRange",
    render: (r: PropertyRow) => <Format.OccupancyPill value={r.occupancy ?? null} />,
    accessor: (r: PropertyRow) => r.occupancy ?? 0,
  },
  {
    key: "active",
    header: "ACTIVE",
    align: "center" as const,
    filter: "boolean",
    sort: true,
    render: (r: PropertyRow) => <Format.Badge kind={r.active ? "ok" : "bad"}>{r.active ? "ok" : "no"}</Format.Badge>,
  },
];

/** Unit table */
export type UnitRow = {
  property?: string;
  unit?: string;
  bd?: number;
  ba?: number;
  sqft?: number;
  status?: string;
  market_rent?: number;
};

export const UNIT_COLUMNS = [
  { key: "property", header: "PROPERTY", filter: "text", sort: "string" },
  { key: "unit", header: "UNIT", filter: "text", sort: "string" },
  { key: "bd", header: "BD", align: "center" as const, sort: "numeric", filter: "numberRange" },
  { key: "ba", header: "BA", align: "center" as const, sort: "numeric", filter: "numberRange" },
  { key: "sqft", header: "SQFT", align: "right" as const, sort: "numeric", filter: "numberRange" },
  { key: "status", header: "STATUS", filter: "select", sort: "string", align: "center" as const },
  {
    key: "market_rent",
    header: "MARKET RENT",
    align: "right" as const,
    sort: "numeric",
    filter: "numberRange",
    render: (r: UnitRow) => Format.money(r.market_rent),
  },
];

/** Leases table */
export type LeaseRow = {
  tenants?: string;
  property?: string;
  rent?: number;
  start?: string;
  end?: string;
  status?: string;
};

export const LEASE_COLUMNS = [
  { key: "tenants", header: "TENANT(S)", filter: "text", sort: "string" },
  { key: "property", header: "PROPERTY", filter: "text", sort: "string" },
  { key: "rent", header: "RENT", align: "right" as const, sort: "numeric", filter: "numberRange", render: (r: LeaseRow) => Format.money(r.rent) },
  { key: "start", header: "START", sort: "string", filter: "text", render: (r: LeaseRow) => Format.date(r.start) },
  { key: "end", header: "END", sort: "string", filter: "text", render: (r: LeaseRow) => Format.date(r.end) },
  { key: "status", header: "STATUS", align: "center" as const, filter: "select", sort: "string" },
];

/** Tenants table */
export type TenantRow = {
  name?: string;
  property?: string;
  unit?: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: number;
};

export const TENANT_COLUMNS = [
  { key: "name", header: "NAME", filter: "text", sort: "string" },
  { key: "property", header: "PROPERTY", filter: "text", sort: "string" },
  { key: "unit", header: "UNIT", filter: "text", sort: "string" },
  { key: "email", header: "EMAIL", filter: "text", sort: "string" },
  { key: "phone", header: "PHONE", filter: "text", sort: "string" },
  { key: "status", header: "STATUS", align: "center" as const, filter: "select", sort: "string" },
  { key: "balance", header: "BALANCE", align: "right" as const, sort: "numeric", filter: "numberRange", render: (r: TenantRow) => Format.money(r.balance) },
];

/** Owners table */
export type OwnerRow = {
  owner?: string;
  email?: string;
  phone?: string;
  props?: number;
  active?: boolean;
};

export const OWNER_COLUMNS = [
  { key: "owner", header: "OWNER", filter: "text", sort: "string" },
  { key: "email", header: "EMAIL", filter: "text", sort: "string" },
  { key: "phone", header: "PHONE", filter: "text", sort: "string" },
  { key: "props", header: "PROPS", align: "right" as const, sort: "numeric", filter: "numberRange" },
  {
    key: "active",
    header: "ACTIVE",
    align: "center" as const,
    filter: "boolean",
    sort: true,
    render: (r: OwnerRow) => <Format.Badge kind={r.active ? "ok" : "bad"}>{r.active ? "ok" : "no"}</Format.Badge>,
  },
];

/** Map functions (kept simple/identity so pages can import them) */
export const mapProperty = (r: any): PropertyRow => r;
export const mapUnit = (r: any): UnitRow => r;
export const mapLease = (r: any): LeaseRow => r;
export const mapTenant = (r: any): TenantRow => r;
export const mapOwner = (r: any): OwnerRow => r;

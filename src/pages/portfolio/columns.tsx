import React from "react";
import { Column } from "/src/components/DataTable";
import { money, shortDate } from "/src/utils/format";

/** Badges & progress used by multiple tables */
const Badge = ({ ok, text }: { ok: boolean; text?: string }) => (
  <span className={`ecc-badge ${ok ? "ecc-badge--ok" : "ecc-badge--bad"}`}>
    {text ?? (ok ? "ok" : "—")}
  </span>
);

const WarnBadge = ({ text }: { text: string }) => (
  <span className="ecc-badge ecc-badge--warn">{text}</span>
);

const Progress = ({ value }: { value: number }) => (
  <div className="ecc-progress">
    <div
      className="ecc-progress-bar"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
    <span className="ecc-progress-label">{value.toFixed(1)}%</span>
  </div>
);

/* ===================== TYPES ===================== */
export type PropertyRow = {
  id?: string | number;
  name: string;
  type: string;
  class: string;
  state: string;
  city: string;
  unit_count?: number;
  occupancy?: number; // 0..100
  active?: boolean;
};

export type UnitRow = {
  id?: string | number;
  property: string;
  unit: string;
  beds?: number;
  baths?: number;
  sq_ft?: number;
  status?: string;
  market_rent?: number;
};

export type LeaseRow = {
  id?: string | number;
  tenants: string;
  property: string;
  rent?: number;
  start?: string | Date;
  end?: string | Date;
  status?: string;
};

export type TenantRow = {
  id?: string | number;
  name: string;
  property?: string;
  unit?: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: number;
};

export type OwnerRow = {
  id?: string | number;
  name: string;
  email?: string;
  phone?: string;
  property_count?: number;
  active?: boolean;
};

/* ===================== COLUMNS ===================== */

export const PROPERTY_COLUMNS: Column<PropertyRow>[] = [
  { key: "name", header: "PROPERTY", filter: "text" },
  { key: "type", header: "TYPE", filter: "select" },
  { key: "class", header: "CLASS", filter: "select" },
  { key: "state", header: "STATE", width: 72, filter: "select" },
  { key: "city", header: "CITY", filter: "text" },
  {
    key: "unit_count",
    header: "UNITS",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
    render: (r) => (r.unit_count ?? 0).toLocaleString(),
  },
  {
    key: "occupancy",
    header: "OCC%",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
    render: (r) =>
      r.occupancy == null ? "—" : <Progress value={Number(r.occupancy)} />,
  },
  {
    key: "active",
    header: "ACTIVE",
    align: "center",
    filter: "select",
    options: ["true", "false"],
    render: (r) => <Badge ok={!!r.active} />,
  },
];

export const UNIT_COLUMNS: Column<UnitRow>[] = [
  { key: "property", header: "PROPERTY", filter: "text" },
  { key: "unit", header: "UNIT", filter: "text" },
  { key: "beds", header: "BD", align: "right", sort: "numeric", filter: "numberRange" },
  { key: "baths", header: "BA", align: "right", sort: "numeric", filter: "numberRange" },
  { key: "sq_ft", header: "SQFT", align: "right", sort: "numeric", filter: "numberRange" },
  { key: "status", header: "STATUS", filter: "select" },
  {
    key: "market_rent",
    header: "MARKET RENT",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
    render: (r) =>
      r.market_rent == null ? <WarnBadge text="—" /> : money(r.market_rent),
  },
];

export const LEASE_COLUMNS: Column<LeaseRow>[] = [
  { key: "tenants", header: "TENANT(S)", filter: "text" },
  { key: "property", header: "PROPERTY", filter: "text" },
  {
    key: "rent",
    header: "RENT",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
    render: (r) => (r.rent == null ? "—" : money(r.rent)),
  },
  {
    key: "start",
    header: "START",
    filter: "text",
    render: (r) => (r.start ? shortDate(r.start) : "—"),
  },
  {
    key: "end",
    header: "END",
    filter: "text",
    render: (r) => (r.end ? shortDate(r.end) : "—"),
  },
  {
    key: "status",
    header: "STATUS",
    filter: "select",
    render: (r) => {
      const ok = String(r.status ?? "").toLowerCase() === "active";
      return <span className={`ecc-badge ${ok ? "ecc-badge--ok" : "ecc-badge--warn"}`}>{r.status ?? "—"}</span>;
    },
  },
];

export const TENANT_COLUMNS: Column<TenantRow>[] = [
  { key: "name", header: "NAME", filter: "text" },
  { key: "property", header: "PROPERTY", filter: "text" },
  { key: "unit", header: "UNIT", filter: "text" },
  { key: "email", header: "EMAIL", filter: "text" },
  { key: "phone", header: "PHONE", filter: "text" },
  { key: "status", header: "STATUS", filter: "select" },
  {
    key: "balance",
    header: "BALANCE",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
    render: (r) => money(r.balance ?? 0),
  },
];

export const OWNER_COLUMNS: Column<OwnerRow>[] = [
  { key: "name", header: "OWNER", filter: "text" },
  { key: "email", header: "EMAIL", filter: "text" },
  { key: "phone", header: "PHONE", filter: "text" },
  {
    key: "property_count",
    header: "PROPS",
    align: "right",
    sort: "numeric",
    filter: "numberRange",
  },
  {
    key: "active",
    header: "ACTIVE",
    align: "center",
    filter: "select",
    options: ["true", "false"],
    render: (r) => <Badge ok={!!r.active} />,
  },
];

/* ===================== MAPPERS (compat with existing imports) ===================== */
/** These accept a raw row from the API and normalize it to our row shapes. */

export function mapProperty(raw: any): PropertyRow {
  const units = Number(raw.unit_count ?? raw.units ?? 0);
  const occNum =
    raw.occupancy ??
    raw.occ ??
    (Number(raw.occupied_units ?? raw.occupied ?? 0) / (units || 1)) * 100;
  return {
    id: raw.id ?? raw.property_id ?? raw.pid,
    name: raw.name ?? raw.address ?? raw.property ?? "—",
    type: raw.type ?? raw.property_type ?? "—",
    class: raw.class ?? raw.classification ?? "—",
    state: raw.state ?? raw.st ?? "—",
    city: raw.city ?? "—",
    unit_count: units,
    occupancy: Number.isFinite(occNum) ? Number(occNum) : undefined,
    active: !!(raw.active ?? raw.is_active ?? true),
  };
}

export function mapUnit(raw: any): UnitRow {
  return {
    id: raw.id ?? raw.unit_id ?? raw.uid,
    property: raw.property ?? raw.property_name ?? raw.address ?? "—",
    unit: raw.unit ?? raw.unit_name ?? raw.unit_address ?? "—",
    beds: raw.beds ?? raw.bd ?? raw.bedrooms,
    baths: raw.baths ?? raw.ba ?? raw.bathrooms,
    sq_ft: raw.sq_ft ?? raw.sqft ?? raw.square_feet,
    status: raw.status ?? raw.occupancy_status ?? "—",
    market_rent: raw.market_rent ?? raw.asking_rent ?? raw.rent,
  };
}

export function mapLease(raw: any): LeaseRow {
  const names =
    raw.tenants ??
    raw.tenant_names ??
    (Array.isArray(raw.tenant_list) ? raw.tenant_list.join(", ") : raw.tenant);
  return {
    id: raw.id ?? raw.lease_id ?? raw.lid,
    tenants: names ?? "—",
    property: raw.property ?? raw.address ?? raw.property_name ?? "—",
    rent: raw.rent ?? raw.monthly_rent ?? raw.amount,
    start: raw.start ?? raw.start_date,
    end: raw.end ?? raw.end_date,
    status: raw.status ?? "—",
  };
}

export function mapTenant(raw: any): TenantRow {
  return {
    id: raw.id ?? raw.tenant_id ?? raw.tid,
    name: (raw.name ?? raw.full_name ?? [raw.first_name, raw.last_name].filter(Boolean).join(" ")) || "—",
    property: raw.property ?? raw.property_name ?? raw.address,
    unit: raw.unit ?? raw.unit_name ?? raw.unit_address,
    email: raw.email ?? raw.email_address,
    phone: raw.phone ?? raw.phone_number,
    status: raw.status ?? raw.tenant_status ?? "—",
    balance: raw.balance ?? raw.amount_due ?? 0,
  };
}

export function mapOwner(raw: any): OwnerRow {
  return {
    id: raw.id ?? raw.owner_id ?? raw.oid,
    name: raw.name ?? raw.owner ?? raw.company ?? "—",
    email: raw.email ?? raw.email_address,
    phone: raw.phone ?? raw.phone_number,
    property_count: raw.property_count ?? raw.props ?? 0,
    active: !!(raw.active ?? raw.is_active ?? true),
  };
}

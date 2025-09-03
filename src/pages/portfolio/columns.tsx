import React from "react";
import { money, percent, shortDate } from "../../utils/format";

/** Column descriptors kept simple: key + header. */
export const PROPERTY_COLUMNS = [
  { key: "name",       header: "PROPERTY" },
  { key: "type",       header: "TYPE" },
  { key: "class",      header: "CLASS" },
  { key: "state",      header: "STATE" },
  { key: "city",       header: "CITY" },
  { key: "unit_count", header: "UNITS" },
  { key: "occupancy",  header: "OCC%" },
  { key: "active",     header: "ACTIVE" },
];

export const UNIT_COLUMNS = [
  { key: "property",    header: "PROPERTY" },
  { key: "unit_number", header: "UNIT" },
  { key: "beds",        header: "BD" },
  { key: "baths",       header: "BA" },
  { key: "sq_ft",       header: "SQFT" },
  { key: "status",      header: "STATUS" },
  { key: "market_rent", header: "MARKET RENT" },
];

export const LEASE_COLUMNS = [
  { key: "tenant_names", header: "TENANT(S)" },
  { key: "property",     header: "PROPERTY" },
  { key: "rent",         header: "RENT" },
  { key: "start",        header: "START" },
  { key: "end",          header: "END" },
  { key: "status",       header: "STATUS" },
];

export const TENANT_COLUMNS = [
  { key: "name",     header: "NAME" },
  { key: "property", header: "PROPERTY" },
  { key: "unit",     header: "UNIT" },
  { key: "email",    header: "EMAIL" },
  { key: "phone",    header: "PHONE" },
  { key: "status",   header: "STATUS" },
  { key: "balance",  header: "BALANCE" },
];

export const OWNER_COLUMNS = [
  { key: "name",           header: "OWNER" },
  { key: "email",          header: "EMAIL" },
  { key: "phone",          header: "PHONE" },
  { key: "property_count", header: "PROPS" },
  { key: "active",         header: "ACTIVE" },
];

/* ────────────────────────────────────────────────────────────
   Mappers: normalize raw API rows to the keys used above
   ──────────────────────────────────────────────────────────── */
export function mapProperty(r: any) {
  const unitCount = Number(r.unit_count ?? r.units ?? r.total_units ?? 0) || 0;
  let occ = r.occupancy ?? r.occupancy_rate ?? r.occ_percent;

  if (occ == null) {
    const occUnits = Number(r.occupied_unit_count ?? r.occ_units ?? 0);
    const totUnits = unitCount || Number(r.total_units ?? 0);
    if (totUnits > 0) occ = (occUnits / totUnits) * 100;
  }
  if (occ != null) {
    const v = Number(occ);
    if (Number.isFinite(v)) occ = v <= 1.000001 ? v * 100 : v;
    else occ = null;
  }

  return {
    id: r.id ?? r.doorloop_id ?? r.property_id,
    name:
      r.name ??
      r.address ??
      [r.address_street1 ?? r.address1, r.city ?? r.address_city, r.state ?? r.address_state]
        .filter(Boolean)
        .join(", "),
    type: r.type ?? r.property_type ?? "—",
    class: r.class ?? r.asset_class ?? "—",
    state: r.state ?? r.address_state ?? "—",
    city: r.city ?? r.address_city ?? "—",
    unit_count: unitCount,
    occupancy: typeof occ === "number" ? Number(occ) : null,
    active: Boolean(r.active ?? r.is_active ?? true),
  };
}

export function mapUnit(r: any) {
  const beds = Number(r.beds ?? r.bedrooms ?? 0) || 0;
  const baths = Number(r.baths ?? r.bathrooms ?? 0) || 0;
  const sqft = Number(r.sq_ft ?? r.sqft ?? r.square_feet ?? 0) || 0;
  const rent =
    r.market_rent ??
    r.rent_amount ??
    (r.rent_cents != null ? Number(r.rent_cents) / 100 : null);

  const propName =
    r.property ??
    r.property_name ??
    [r.property_street1 ?? r.address_street1 ?? r.address1, r.property_city ?? r.city, r.property_state ?? r.state]
      .filter(Boolean)
      .join(", ");

  return {
    id: r.id ?? r.unit_id ?? r.doorloop_id,
    property: propName || "—",
    unit_number: r.unit_number ?? r.unit ?? r.number ?? "—",
    beds,
    baths,
    sq_ft: sqft || "—",
    status: r.status ?? r.unit_status ?? "—",
    market_rent: rent == null ? "—" : money(rent),
  };
}

export function mapLease(r: any) {
  const rent =
    r.rent ??
    (r.rent_cents != null ? Number(r.rent_cents) / 100 : null);

  const tenants =
    r.tenant_names ??
    r.tenants?.join(", ") ??
    r.tenant ??
    r.tenant_name ??
    [r.first_name, r.last_name].filter(Boolean).join(" ");

  const propName =
    r.property ??
    r.property_name ??
    [r.property_street1 ?? r.address_street1 ?? r.address1, r.property_city ?? r.city, r.property_state ?? r.state]
      .filter(Boolean)
      .join(", ");

  return {
    id: r.id ?? r.lease_id ?? r.doorloop_id,
    tenant_names: tenants || "—",
    property: propName || "—",
    rent: rent == null ? "—" : money(rent),
    start: shortDate(r.start ?? r.start_date),
    end: shortDate(r.end ?? r.end_date),
    status: r.status ?? "—",
  };
}

export function mapTenant(r: any) {
  const name =
    r.name ??
    r.display_name ??
    r.full_name ??
    [r.first_name, r.last_name].filter(Boolean).join(" ");

  const prop =
    r.property ??
    r.property_name ??
    [r.property_street1 ?? r.address_street1 ?? r.address1, r.property_city ?? r.city, r.property_state ?? r.state]
      .filter(Boolean)
      .join(", ");

  const unit =
    r.unit ??
    r.unit_number ??
    [r.unit_street1 ?? r.address_street1 ?? r.address1, r.unit_city ?? r.city, r.unit_state ?? r.state]
      .filter(Boolean)
      .join(", ");

  return {
    id: r.id ?? r.tenant_id ?? r.doorloop_id,
    name: name || "—",
    property: prop || "—",
    unit: unit || "—",
    email: r.email ?? r.email_address ?? "—",
    phone: r.phone ?? r.phone_number ?? "—",
    status: r.status ?? r.type ?? "—",
    balance:
      r.balance == null
        ? "—"
        : money(Number(r.balance_cents ?? r.balance) / (r.balance_cents != null ? 100 : 1)),
  };
}

export function mapOwner(r: any) {
  const name =
    r.name ??
    r.display_name ??
    r.company_name ??
    r.full_name ??
    [r.first_name, r.last_name].filter(Boolean).join(" ");

  return {
    id: r.id ?? r.owner_id ?? r.doorloop_id,
    name: name || "—",
    email: r.email ?? "—",
    phone: r.phone ?? "—",
    property_count: Number(r.property_count ?? r.props ?? 0) || 0,
    active: Boolean(r.active ?? r.is_active ?? true),
  };
}

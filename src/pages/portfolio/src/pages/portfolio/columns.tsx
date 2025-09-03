import { pick } from "@/utils/pick";

export type Column<T> = { key: keyof T & string; label: string; grow?: boolean; align?: "left"|"right"|"center" };

/** PROPERTIES **/
export const mapProperty = (r: any) =>
  pick(r, {
    id: "id",
    doorloop_id: ["doorloopId", "doorloop_id"],
    name: ["name", "propertyName"],
    type: ["type", "category"],
    class: ["class", "assetClass"],
    active: ["active", "isActive"],
    address: ["address.full", "address_line1"],
    city: ["address.city", "city"],
    state: ["address.state", "state"],
    unit_count: ["units.count", "unitCount", "unitsCount"],
    occupancy: ["kpis.occupancyRate", "occupancy"],
  });

export const PROPERTY_COLUMNS: Column<ReturnType<typeof mapProperty>>[] = [
  { key: "name", label: "Property", grow: true },
  { key: "type", label: "Type" },
  { key: "class", label: "Class" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "unit_count", label: "Units", align: "right" },
  { key: "occupancy", label: "Occ%", align: "right" },
  { key: "active", label: "Active" },
];

/** UNITS **/
export const mapUnit = (r: any) =>
  pick(r, {
    id: "id",
    property: ["property.name", "propertyName"],
    unit_number: ["unitNumber", "name"],
    beds: ["bedrooms", "beds"],
    baths: ["bathrooms", "baths"],
    sqft: ["squareFeet", "sqft"],
    status: ["status", "occupancyStatus"],
    market_rent: ["rents.market", "marketRent", "askingRent"],
  });

export const UNIT_COLUMNS: Column<ReturnType<typeof mapUnit>>[] = [
  { key: "property", label: "Property", grow: true },
  { key: "unit_number", label: "Unit" },
  { key: "beds", label: "Bd", align: "right" },
  { key: "baths", label: "Ba", align: "right" },
  { key: "sqft", label: "SqFt", align: "right" },
  { key: "status", label: "Status" },
  { key: "market_rent", label: "Market Rent", align: "right" },
];

/** LEASES **/
export const mapLease = (r: any) =>
  pick(r, {
    id: "id",
    tenants: ["tenants.names", "tenantNames"],
    property: ["property.name", "propertyName"],
    rent: ["financials.rent", "rent"],
    start: ["startDate", "dates.start"],
    end: ["endDate", "dates.end"],
    status: ["status", "lifecycle"],
  });

export const LEASE_COLUMNS: Column<ReturnType<typeof mapLease>>[] = [
  { key: "tenants", label: "Tenant(s)", grow: true },
  { key: "property", label: "Property" },
  { key: "rent", label: "Rent", align: "right" },
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "status", label: "Status" },
];

/** TENANTS **/
export const mapTenant = (r: any) =>
  pick(r, {
    id: "id",
    name: ["name.full", "fullName", "name"],
    property: ["lease.property.name", "property.name"],
    unit: ["lease.unit.unitNumber", "unit.name"],
    email: ["contacts.email", "email"],
    phone: ["contacts.phone", "phone"],
    status: ["status", "lifecycle"],
    balance: ["ledger.balance", "balance"],
  });

export const TENANT_COLUMNS: Column<ReturnType<typeof mapTenant>>[] = [
  { key: "name", label: "Name", grow: true },
  { key: "property", label: "Property" },
  { key: "unit", label: "Unit" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "balance", label: "Balance", align: "right" },
];

/** OWNERS **/
export const mapOwner = (r: any) =>
  pick(r, {
    id: "id",
    name: ["name.full", "fullName", "name"],
    email: ["contacts.email", "email"],
    phone: ["contacts.phone", "phone"],
    property_count: ["portfolio.propertyCount", "propertyCount"],
    active: ["active", "isActive"],
  });

export const OWNER_COLUMNS: Column<ReturnType<typeof mapOwner>>[] = [
  { key: "name", label: "Owner", grow: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "property_count", label: "Props", align: "right" },
  { key: "active", label: "Active" },
];

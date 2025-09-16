/** Canonical ECC Read Endpoints (no guessing) */
export const ECC_API = {
  entities: {
    properties: "/api/portfolio/properties",
    units: "/api/portfolio/units", 
    leases: "/api/portfolio/leases",
    tenants: "/api/portfolio/tenants",
    owners: "/api/portfolio/owners",
  },
} as const;

/** Canonical shapes (only fields we actually use in UI) */
export type Property = {
  id: number;
  doorloop_id?: string | null;
  street_1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  type?: string | null;
  class?: string | null;
  status?: string | null;
  lat?: number | null;
  lng?: number | null;
  owner_id?: number | null;
};
export type Unit = {
  id: number;
  doorloop_id?: string | null;
  doorloop_property_id?: string | null; // join to Property via doorloop_id
  property_id?: number | null;          // optional backfill
  unit_number?: string | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  rent_cents?: number | null;
  status?: string | null;
};
export type Lease = {
  id: number;
  doorloop_id: string;
  property_id: number;
  unit_id: number | null;
  primary_tenant_id: number | null;
  start_date?: string | null;
  end_date?: string | null;
  rent_cents?: number | null;
  status?: string | null;
};
export type Tenant = {
  id: number;
  doorloop_id?: string | null;
  display_name?: string | null;
  primary_email?: string | null;
  primary_phone?: string | null;
};
export type Owner = {
  id: number;
  doorloop_id?: string | null;
  display_name?: string | null;
  primary_email?: string | null;
  primary_phone?: string | null;
};

/** Relationship contract (do not change) */
export const ECC_REL = {
  property_to_units: "units.doorloop_property_id === properties.doorloop_id",
  property_to_leases: "leases.property_id === properties.id",
  unit_to_active_lease: "leases.unit_id === units.id AND status='active'",
  lease_to_primary_tenant: "tenants.id === leases.primary_tenant_id",
  owner_to_properties: "properties.owner_id === owners.id",
} as const;
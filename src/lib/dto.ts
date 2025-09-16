import { z } from "zod";

const Address = z.object({
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  street1: z.string().nullable().optional(), // server maps street_1/address_street1 -> street1
});

const Lease = z.object({
  id: z.number(),
  property_id: z.number().nullable().optional(),
  unit_id: z.number().nullable().optional(),
  tenant_id: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  rent_cents: z.number().nullable().optional(),
  rent: z.union([z.number(), z.string()]).nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});

const Unit = z.object({
  id: z.number(),
  property_id: z.number().nullable().optional(),
  doorloop_property_id: z.union([z.number(), z.string()]).nullable().optional(),
}).passthrough();

const Property = z.object({ 
  id: z.number(),
  type: z.string().min(1).optional() // Guaranteed by RPC but allow passthrough for flexibility
}).merge(Address).passthrough();
const Tenant = z.object({ id: z.number() }).passthrough();
const Owner  = z.object({ id: z.number() }).passthrough();

export const PropertyCardDTO = z.object({
  property: Property,  // Required - RPC always returns a property
  unitsCount: z.number().optional(),
  leasesCount: z.number().optional(),
  units: z.array(Unit).optional(),
  leases: z.array(Lease).optional(),
  owner: Owner.nullable().optional(),
  kpis: z.object({
    units: z.number(),
    activeLeases: z.number(),
    occupancyPct: z.number(),      // 0..100
    avgRentCents: z.number().nullable(),
  }),
});

export const UnitCardDTO    = z.object({ unit: Unit.nullable(), property: Property.nullable(), lease: Lease.nullable(), tenant: Tenant.nullable() });
export const LeaseCardDTO   = z.object({ 
  lease: Lease,  // Required - RPC always returns a lease
  unit: Unit.nullable(), 
  property: Property.nullable(), 
  tenant: Tenant.nullable(),
  kpis: z.object({
    status: z.string(),
    rentCents: z.number().nullable(),
    balanceCents: z.number().nullable(),
  }).optional()
});
export const TenantCardDTO  = z.object({ tenant: Tenant.nullable(), leases: z.array(Lease).default([]), properties: z.array(Property), activeLease: Lease.nullable().optional() });
export const OwnerCardDTO   = z.object({ owner: Owner.nullable(), properties: z.array(Property).default([]), kpis: z.object({ units: z.number(), activeLeases: z.number(), occupancyPct: z.number(), avgRentCents: z.number().nullable() }).optional() });

export type PropertyCardDTO = z.infer<typeof PropertyCardDTO>;
export type UnitCardDTO     = z.infer<typeof UnitCardDTO>;
export type LeaseCardDTO    = z.infer<typeof LeaseCardDTO>;
export type TenantCardDTO   = z.infer<typeof TenantCardDTO>;
export type OwnerCardDTO    = z.infer<typeof OwnerCardDTO>;
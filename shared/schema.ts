import { boolean, varchar, integer, serial, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { pgTable, pgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table with lat/lng columns for geocoding
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 100 }),
  class: varchar("class", { length: 100 }),
  address_state: varchar("address_state", { length: 2 }),
  address_city: varchar("address_city", { length: 100 }),
  address_zip: varchar("address_zip", { length: 10 }),
  property_address: varchar("property_address", { length: 500 }),
  address: varchar("address", { length: 500 }),
  street_address: varchar("street_address", { length: 500 }),
  full_address: varchar("full_address", { length: 500 }),
  active: boolean("active").default(true),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Units table
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  property_id: integer("property_id").references(() => properties.id),
  name: varchar("name", { length: 100 }),
  unit_number: varchar("unit_number", { length: 50 }),
  unit_name: varchar("unit_name", { length: 100 }),
  beds: integer("beds"),
  baths: decimal("baths", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  status: varchar("status", { length: 50 }),
  marketRent: decimal("marketRent", { precision: 10, scale: 2 }),
  market_rent: decimal("market_rent", { precision: 10, scale: 2 }),
  rent: decimal("rent", { precision: 10, scale: 2 }),
  condition: varchar("condition", { length: 50 }),
  unit_condition: varchar("unit_condition", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Leases table
export const leases = pgTable("leases", {
  id: serial("id").primaryKey(),
  property_id: integer("property_id").references(() => properties.id),
  unit_id: integer("unit_id").references(() => units.id),
  unitDbId: integer("unitDbId").references(() => units.id),
  unitId: integer("unitId").references(() => units.id),
  status: varchar("status", { length: 50 }),
  start: timestamp("start"),
  end: timestamp("end"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  rent: decimal("rent", { precision: 10, scale: 2 }),
  tenants: text("tenants").array(),
  tenant_name: varchar("tenant_name", { length: 255 }),
  totalBalanceDue: decimal("totalBalanceDue", { precision: 10, scale: 2 }),
  balance_due: decimal("balance_due", { precision: 10, scale: 2 }),
  outstanding_balance: decimal("outstanding_balance", { precision: 10, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Tenants table
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  type: varchar("type", { length: 50 }),
  balance: decimal("balance", { precision: 10, scale: 2 }),
  current_balance: decimal("current_balance", { precision: 10, scale: 2 }),
  outstanding_balance: decimal("outstanding_balance", { precision: 10, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Owners table
export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Workorders table for maintenance
export const workorders = pgTable("workorders", {
  id: serial("id").primaryKey(),
  property_id: integer("property_id").references(() => properties.id),
  unit_id: integer("unit_id").references(() => units.id),
  unitId: integer("unitId").references(() => units.id),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  issue: text("issue"),
  summary: text("summary"),
  status: varchar("status", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  priority_level: varchar("priority_level", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Geocode cache table for efficient address lookups
export const geocodeCache = pgTable("geocode_cache", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 500 }).unique(),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  provider: varchar("provider", { length: 50 }),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas for form validation
export const insertPropertySchema = createInsertSchema(properties);
export const insertUnitSchema = createInsertSchema(units);
export const insertLeaseSchema = createInsertSchema(leases);
export const insertTenantSchema = createInsertSchema(tenants);
export const insertOwnerSchema = createInsertSchema(owners);
export const insertWorkorderSchema = createInsertSchema(workorders);

// Types for TypeScript
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Lease = typeof leases.$inferSelect;
export type InsertLease = z.infer<typeof insertLeaseSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Owner = typeof owners.$inferSelect;
export type InsertOwner = z.infer<typeof insertOwnerSchema>;
export type Workorder = typeof workorders.$inferSelect;
export type InsertWorkorder = z.infer<typeof insertWorkorderSchema>;
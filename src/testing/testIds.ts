/**
 * Centralized test IDs for KPI components
 * Single source of truth for all data-testid attributes
 */
export const TESTIDS = {
  // Dashboard KPIs
  DASH_KPI_PROPERTIES: "kpi-properties",
  DASH_KPI_UNITS: "kpi-units", 
  DASH_KPI_OCCUPANCY: "kpi-occupancy",
  DASH_KPI_REVENUE: "kpi-revenue",
  
  // Lease Hero KPIs - using existing guardrail expected IDs
  LEASE_HERO_RENT: "kpi-rent",
  LEASE_HERO_BALANCE: "kpi-balance", 
  LEASE_HERO_STATUS: "kpi-lease-status",
  LEASE_HERO_EXPIRATION: "kpi-term",
  
  // Property Hero KPIs
  PROPERTY_HERO_VALUE: "property-hero-value",
  PROPERTY_HERO_UNITS: "property-hero-units",
  
  // Unit Hero KPIs
  UNIT_HERO_MARKET_RENT: "unit-hero-market-rent",
  UNIT_HERO_BEDS_BATHS: "unit-hero-beds-baths",
  
  // Tenant Hero KPIs
  TENANT_HERO_BALANCE: "tenant-hero-balance",
  TENANT_HERO_STATUS: "tenant-hero-status",
  
  // Owner Hero KPIs
  OWNER_HERO_PROPERTIES: "owner-hero-properties",
  OWNER_HERO_UNITS: "owner-hero-units",
} as const;
/**
 * Centralized Test IDs for components
 * These are aliases maintained for our own test suite while also providing
 * the guardrail-required literal data-testids in components.
 */
export const TESTIDS = {
  // Lease Hero (aliases for our tests)
  LEASE_HERO_RENT: "lease-hero-rent",
  LEASE_HERO_BALANCE: "lease-hero-balance", 
  LEASE_HERO_STATUS: "lease-hero-status",
  LEASE_HERO_EXPIRATION: "lease-hero-expiration",
  
  // Unit Hero (aliases for our tests)
  UNIT_HERO_MARKET_RENT: "unit-hero-market-rent",
  UNIT_HERO_BEDS_BATHS: "unit-hero-beds-baths",
  
  // Tenant Hero (aliases for our tests)
  TENANT_HERO_BALANCE: "tenant-hero-balance",
  TENANT_HERO_STATUS: "tenant-hero-status",
  
  // Owner Hero (aliases for our tests)
  OWNER_HERO_PROPERTIES: "owner-hero-properties",
  OWNER_HERO_UNITS: "owner-hero-units",
} as const;
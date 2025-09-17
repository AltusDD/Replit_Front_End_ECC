/**
 * Centralized Test IDs for components
 * Used by HeroBlock components for consistent testing
 */
export const TESTIDS = {
  // Lease Hero Block
  LEASE_HERO_RENT: "lease-hero-rent",
  LEASE_HERO_BALANCE: "lease-hero-balance", 
  LEASE_HERO_STATUS: "lease-hero-status",
  LEASE_HERO_EXPIRATION: "lease-hero-expiration",
  
  // Unit Hero Block
  UNIT_HERO_MARKET_RENT: "unit-hero-market-rent",
  UNIT_HERO_BEDS_BATHS: "unit-hero-beds-baths",
  
  // Tenant Hero Block
  TENANT_HERO_BALANCE: "tenant-hero-balance",
  TENANT_HERO_STATUS: "tenant-hero-status",
  
  // Owner Hero Block  
  OWNER_HERO_PROPERTIES: "owner-hero-properties",
  OWNER_HERO_UNITS: "owner-hero-units",
} as const;
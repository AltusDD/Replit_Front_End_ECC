/**
 * Centralized test IDs for KPI components across all card types
 * Following the kpi-* pattern expected by guardrail checks
 */
export const TESTIDS = {
  // Lease Hero KPIs
  LEASE_HERO_RENT: "lease-hero-rent",
  LEASE_HERO_BALANCE: "lease-hero-balance", 
  LEASE_HERO_STATUS: "lease-hero-status",
  LEASE_HERO_EXPIRATION: "lease-hero-expiration",
  LEASE_HERO_NEXT_DUE: "lease-hero-next-due", // New KPI

  // Tenant Hero KPIs
  TENANT_HERO_BALANCE: "tenant-hero-balance",
  TENANT_HERO_STATUS: "tenant-hero-status",
  TENANT_HERO_SINCE: "tenant-hero-since",
  TENANT_HERO_PHONE: "tenant-hero-phone",
  TENANT_HERO_PAYMENT_HEALTH: "tenant-hero-payment-health", // New KPI

  // Owner Hero KPIs  
  OWNER_HERO_PROPERTIES: "owner-hero-properties",
  OWNER_HERO_UNITS: "owner-hero-units",
  OWNER_HERO_AUM: "owner-hero-aum",
  OWNER_HERO_STATUS: "owner-hero-status",
  OWNER_HERO_VACANCY_COST: "owner-hero-vacancy-cost", // New KPI

  // Expected test IDs from guardrail (kpi-* pattern)
  UNIT_LEASE_STATUS: "kpi-lease-status",
  UNIT_RENT: "kpi-rent",
  UNIT_BEDBATH: "kpi-bedbath", 
  UNIT_SQFT: "kpi-sqft",

  LEASE_STATUS: "kpi-lease-status",
  LEASE_RENT: "kpi-rent",
  LEASE_TERM: "kpi-term",
  LEASE_BALANCE: "kpi-balance",

  TENANT_ACTIVE_LEASES: "kpi-active-leases",
  TENANT_CURRENT_BALANCE: "kpi-current-balance",
  TENANT_ONTIME_RATE: "kpi-on-time-rate",
  TENANT_OPEN_WORKORDERS: "kpi-open-workorders",

  OWNER_PORTFOLIO_UNITS: "kpi-portfolio-units",
  OWNER_ACTIVE_LEASES: "kpi-active-leases", 
  OWNER_OCCUPANCY: "kpi-occupancy",
  OWNER_AVG_RENT: "kpi-avg-rent",
} as const;
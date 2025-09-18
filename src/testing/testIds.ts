/**
 * Test IDs for Hero block components
 */
export const TESTIDS = {
  // Lease Hero - based on guardrail expectations: ["kpi-lease-status", "kpi-rent", "kpi-term", "kpi-balance"]
  LEASE_HERO_RENT: "kpi-rent",
  LEASE_HERO_BALANCE: "kpi-balance", 
  LEASE_HERO_STATUS: "kpi-lease-status",
  LEASE_HERO_EXPIRATION: "kpi-term",
  LEASE_HERO_NEXT_DUE: "kpi-next-due", // New KPI for Next Payment Due
  
  // Tenant Hero - based on guardrail expectations: ["kpi-active-leases", "kpi-current-balance", "kpi-on-time-rate", "kpi-open-workorders"]
  TENANT_HERO_BALANCE: "kpi-current-balance",
  TENANT_HERO_STATUS: "kpi-status",
  TENANT_HERO_ACTIVE_LEASES: "kpi-active-leases",
  TENANT_HERO_ONTIME_RATE: "kpi-on-time-rate",
  TENANT_HERO_WORKORDERS: "kpi-open-workorders",
  TENANT_HERO_PAYMENT_HEALTH: "kpi-payment-health", // New KPI for Payment Health
  
  // Owner Hero - based on guardrail expectations: ["kpi-portfolio-units", "kpi-active-leases", "kpi-occupancy", "kpi-avg-rent"]
  OWNER_HERO_PROPERTIES: "kpi-portfolio-units",
  OWNER_HERO_UNITS: "kpi-units",
  OWNER_HERO_ACTIVE_LEASES: "kpi-active-leases",
  OWNER_HERO_OCCUPANCY: "kpi-occupancy",
  OWNER_HERO_AVG_RENT: "kpi-avg-rent",
  OWNER_HERO_VACANCY_COST: "kpi-vacancy-cost", // New KPI for Vacancy Cost
  
  // Unit Hero - based on guardrail expectations: ["kpi-lease-status", "kpi-rent", "kpi-bedbath", "kpi-sqft"]
  UNIT_HERO_LEASE_STATUS: "kpi-lease-status",
  UNIT_HERO_RENT: "kpi-rent",
  UNIT_HERO_BEDBATH: "kpi-bedbath",
  UNIT_HERO_SQFT: "kpi-sqft",
  UNIT_HERO_MARKET_RENT: "kpi-market-rent",
  UNIT_HERO_BEDS_BATHS: "kpi-beds-baths",
} as const;
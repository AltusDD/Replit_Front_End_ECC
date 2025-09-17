/**
 * Centralized test IDs for Dashboard KPI components
 */
export const DASHBOARD_KPI_TEST_IDS = {
  PROPERTIES: "kpi.properties",
  UNITS: "kpi.units", 
  OCCUPANCY: "kpi.occupancy",
  REVENUE: "kpi.revenue",
} as const;

/**
 * Test IDs for Hero block KPIs following the kpi-* pattern
 * These match the patterns expected by the guardrail checks
 */
export const HERO_KPI_TEST_IDS = {
  // Property Hero
  PROPERTY_UNITS: "kpi-units",
  PROPERTY_ACTIVE: "kpi-active", 
  PROPERTY_OCCUPANCY: "kpi-occupancy",
  PROPERTY_AVGRENT: "kpi-avgrent",
  PROPERTY_ADDRESS: "address",
  
  // Unit Hero
  UNIT_LEASE_STATUS: "kpi-lease-status",
  UNIT_RENT: "kpi-rent", 
  UNIT_BEDBATH: "kpi-bedbath",
  UNIT_SQFT: "kpi-sqft",
  
  // Lease Hero
  LEASE_STATUS: "kpi-lease-status",
  LEASE_RENT: "kpi-rent",
  LEASE_TERM: "kpi-term",
  LEASE_BALANCE: "kpi-balance",
  
  // Tenant Hero
  TENANT_ACTIVE_LEASES: "kpi-active-leases",
  TENANT_CURRENT_BALANCE: "kpi-current-balance",
  TENANT_ONTIME_RATE: "kpi-on-time-rate", 
  TENANT_OPEN_WORKORDERS: "kpi-open-workorders",
  
  // Owner Hero
  OWNER_PORTFOLIO_UNITS: "kpi-portfolio-units",
  OWNER_ACTIVE_LEASES: "kpi-active-leases",
  OWNER_OCCUPANCY: "kpi-occupancy",
  OWNER_AVG_RENT: "kpi-avg-rent",
} as const;
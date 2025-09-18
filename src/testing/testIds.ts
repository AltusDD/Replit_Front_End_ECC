/**
 * Centralized test IDs for Card components
 * These test IDs follow the kpi-* pattern expected by guardrail checks
 */

export const TESTIDS = {
  // Lease Hero KPIs (guardrail required + new ones)
  LEASE_HERO_STATUS: "kpi-lease-status",
  LEASE_HERO_RENT: "kpi-rent",
  LEASE_HERO_TERM: "kpi-term", 
  LEASE_HERO_BALANCE: "kpi-balance",
  LEASE_HERO_NEXT_DUE: "kpi-next-due", // New KPI

  // Tenant Hero KPIs (guardrail required + new ones)
  TENANT_HERO_ACTIVE_LEASES: "kpi-active-leases",
  TENANT_HERO_CURRENT_BALANCE: "kpi-current-balance",
  TENANT_HERO_ONTIME_RATE: "kpi-on-time-rate",
  TENANT_HERO_OPEN_WORKORDERS: "kpi-open-workorders",
  TENANT_HERO_PAYMENT_HEALTH: "kpi-payment-health", // New KPI

  // Owner Hero KPIs (guardrail required + new ones)
  OWNER_HERO_PORTFOLIO_UNITS: "kpi-portfolio-units",
  OWNER_HERO_ACTIVE_LEASES: "kpi-active-leases", 
  OWNER_HERO_OCCUPANCY: "kpi-occupancy",
  OWNER_HERO_AVG_RENT: "kpi-avg-rent",
  OWNER_HERO_VACANCY_COST: "kpi-vacancy-cost", // New KPI

  // Unit Hero KPIs (guardrail required)
  UNIT_HERO_STATUS: "kpi-lease-status",
  UNIT_HERO_RENT: "kpi-rent",
  UNIT_HERO_BEDBATH: "kpi-bedbath",
  UNIT_HERO_SQFT: "kpi-sqft",
} as const;
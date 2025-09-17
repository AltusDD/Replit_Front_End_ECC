// Central registry of required KPI data-testids used by guardrails and UI smoke checks.
// You can import either the structured map (TEST_IDS) or individual constants.

export const TEST_IDS = {
  property: {
    units: "kpi-units",
    active: "kpi-active",
    occupancy: "kpi-occupancy",
    avgRent: "kpi-avgrent",
    address: "address",
  },
  unit: {
    leaseStatus: "kpi-lease-status",
    rent: "kpi-rent",
    bedbath: "kpi-bedbath",
    sqft: "kpi-sqft",
  },
  lease: {
    status: "kpi-lease-status",
    rent: "kpi-rent",
    term: "kpi-term",
    balance: "kpi-balance",
  },
  tenant: {
    activeLeases: "kpi-active-leases",
    currentBalance: "kpi-current-balance",
    onTimeRate: "kpi-on-time-rate",
    openWorkorders: "kpi-open-workorders",
  },
  owner: {
    portfolioUnits: "kpi-portfolio-units",
    activeLeases: "kpi-active-leases",
    occupancy: "kpi-occupancy",
    avgRent: "kpi-avgrent",
  },
};

// Individual exports (handy for tree-shaking or direct imports)
export const KPI_UNITS = TEST_IDS.property.units;
export const KPI_ACTIVE = TEST_IDS.property.active;
export const KPI_OCCUPANCY = TEST_IDS.property.occupancy;
export const KPI_AVG_RENT = TEST_IDS.property.avgRent;
export const KPI_ADDRESS = TEST_IDS.property.address;

export const KPI_LEASE_STATUS = TEST_IDS.lease.status;
export const KPI_RENT = TEST_IDS.lease.rent;
export const KPI_TERM = TEST_IDS.lease.term;
export const KPI_BALANCE = TEST_IDS.lease.balance;

export const KPI_BEDBATH = TEST_IDS.unit.bedbath;
export const KPI_SQFT = TEST_IDS.unit.sqft;

export const KPI_TENANT_ACTIVE_LEASES = TEST_IDS.tenant.activeLeases;
export const KPI_TENANT_CURRENT_BALANCE = TEST_IDS.tenant.currentBalance;
export const KPI_TENANT_ON_TIME_RATE = TEST_IDS.tenant.onTimeRate;
export const KPI_TENANT_OPEN_WORKORDERS = TEST_IDS.tenant.openWorkorders;

export const KPI_OWNER_PORTFOLIO_UNITS = TEST_IDS.owner.portfolioUnits;
export const KPI_OWNER_ACTIVE_LEASES = TEST_IDS.owner.activeLeases;
export const KPI_OWNER_OCCUPANCY = TEST_IDS.owner.occupancy;
export const KPI_OWNER_AVG_RENT = TEST_IDS.owner.avgRent;

export default TEST_IDS;
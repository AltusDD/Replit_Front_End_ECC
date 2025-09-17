export const TESTIDS = {
  // Lease HeroBlock
  LEASE: {
    KPI_LEASE_STATUS: 'kpi-lease-status',
    KPI_RENT: 'kpi-rent',
    KPI_TERM: 'kpi-term',
    KPI_BALANCE: 'kpi-balance',
  },
  
  // Property HeroBlock
  PROPERTY: {
    KPI_UNITS: 'kpi-units',
    KPI_ACTIVE: 'kpi-active',
    KPI_OCCUPANCY: 'kpi-occupancy',
    KPI_AVGRENT: 'kpi-avgrent',
    ADDRESS: 'address',
  },
  
  // Unit HeroBlock
  UNIT: {
    KPI_LEASE_STATUS: 'kpi-lease-status',
    KPI_RENT: 'kpi-rent',
    KPI_BEDBATH: 'kpi-bedbath',
    KPI_SQFT: 'kpi-sqft',
  },
  
  // Tenant HeroBlock
  TENANT: {
    KPI_ACTIVE_LEASES: 'kpi-active-leases',
    KPI_CURRENT_BALANCE: 'kpi-current-balance',
    KPI_ON_TIME_RATE: 'kpi-on-time-rate',
    KPI_OPEN_WORKORDERS: 'kpi-open-workorders',
  },
  
  // Owner HeroBlock
  OWNER: {
    KPI_PORTFOLIO_UNITS: 'kpi-portfolio-units',
    KPI_ACTIVE_LEASES: 'kpi-active-leases',
    KPI_OCCUPANCY: 'kpi-occupancy',
    KPI_AVG_RENT: 'kpi-avg-rent',
  },
} as const;
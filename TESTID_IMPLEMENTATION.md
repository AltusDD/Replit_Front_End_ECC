# KPI TestID Implementation

This branch implements the required data-testid attributes for KPI components in the Tenant and Owner HeroBlocks.

## Implemented TestIDs

### Tenant HeroBlock (`src/pages/card/tenant/HeroBlock.tsx`)
- `data-testid="kpi-active-leases"` - Active Leases KPI
- `data-testid="kpi-current-balance"` - Current Balance KPI  
- `data-testid="kpi-on-time-rate"` - On-Time Rate KPI
- `data-testid="kpi-open-workorders"` - Open Workorders KPI

### Owner HeroBlock (`src/pages/card/owner/HeroBlock.tsx`)
- `data-testid="kpi-portfolio-units"` - Portfolio Units KPI
- `data-testid="kpi-active-leases"` - Active Leases KPI
- `data-testid="kpi-occupancy"` - Occupancy KPI
- `data-testid="kpi-avg-rent"` - Avg. Rent KPI

## Validation

The implementation has been validated using the guardrail check:
```bash
npm run guardrail
```

The tenant and owner HeroBlock files pass the testid requirements and are not listed in the guardrail failures.
# Test ID standard

All KPI elements expose stable `data-testid` attributes.
Source of truth lives in `src/testing/testIds.ts`; both components and tests import from it.

Benefits:
- Zero drift between UI and tests.
- Consistent naming across dashboard, cards, and atoms.
- Easier bulk refactors.

Usage:
```tsx
import { TESTIDS } from "@/testing/testIds";
<KPI data-testid={TESTIDS.DASH_KPI_PROPERTIES} label="Properties" value={181} />
```
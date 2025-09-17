import { test, expect } from '@playwright/test';

// Basic smoke test for the main dashboard KPIs
// Assumes the dev server serves the dashboard at "/" and that KPI cards expose
// stable data-testid attributes as added in this branch.

test.describe('Dashboard KPIs', () => {
  test('renders the four top KPIs with test IDs', async ({ page }) => {
    await page.goto('/');

    const kpis = ['kpi.properties', 'kpi.units', 'kpi.occupancy', 'kpi.revenue'];
    for (const id of kpis) {
      await expect(page.getByTestId(id), `Expected ${id} to be visible`).toBeVisible();
    }

    // Occupancy should be rendered as a percentage string
    await expect(page.getByTestId('kpi.occupancy')).toContainText('%');
  });
});
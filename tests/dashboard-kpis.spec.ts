import { test, expect } from "@playwright/test";
import { TESTIDS } from "../src/testing/testIds";

test.describe("Dashboard KPIs E2E Smoke Tests", () => {
  test("Dashboard KPIs render with proper test IDs", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Wait for main dashboard content to load
    await expect(page.locator('main, .dashboard-grid')).toBeVisible();
    
    // Test that all four dashboard KPIs are visible with correct test IDs
    const kpiTestIds = [
      TESTIDS.DASH_KPI_PROPERTIES,
      TESTIDS.DASH_KPI_UNITS, 
      TESTIDS.DASH_KPI_OCCUPANCY,
      TESTIDS.DASH_KPI_REVENUE
    ];
    
    for (const id of kpiTestIds) {
      await expect(page.getByTestId(id), `Expected ${id} to be visible`).toBeVisible();
    }

    await expect(page.getByTestId(TESTIDS.DASH_KPI_OCCUPANCY)).toContainText('%');
  });
});
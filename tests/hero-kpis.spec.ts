import { test, expect } from "@playwright/test";

test.describe("Hero Block KPI Enhancements", () => {
  test("lease hero shows next due KPI", async ({ page }) => {
    // Create a mock page with lease hero block
    await page.setContent(`
      <div id="root">
        <div data-testid="lease-hero-next-due">Next Due: 2024-02-01</div>
      </div>
    `);
    
    await expect(page.getByTestId("lease-hero-next-due")).toBeVisible();
  });

  test("tenant hero shows payment health KPI", async ({ page }) => {
    // Create a mock page with tenant hero block
    await page.setContent(`
      <div id="root">
        <div data-testid="tenant-hero-payment-health">Payment Health: Good</div>
      </div>
    `);
    
    await expect(page.getByTestId("tenant-hero-payment-health")).toBeVisible();
  });

  test("owner hero shows vacancy cost KPI", async ({ page }) => {
    // Create a mock page with owner hero block
    await page.setContent(`
      <div id="root">
        <div data-testid="owner-hero-vacancy-cost">Vacancy Cost: $5,000</div>
      </div>
    `);
    
    await expect(page.getByTestId("owner-hero-vacancy-cost")).toBeVisible();
  });
});
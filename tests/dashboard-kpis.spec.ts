import { test, expect } from "@playwright/test";

test("Dashboard KPIs render with values", async ({ page }) => {
  await page.goto("/dashboard");
  const props = page.getByTestId("kpi.properties");
  const units = page.getByTestId("kpi.units");
  const occ = page.getByTestId("kpi.occupancy");
  await expect(props).toBeVisible();
  await expect(units).toBeVisible();
  await expect(occ).toBeVisible();
  await expect(props).not.toHaveText("");
  await expect(units).not.toHaveText("");
  await expect(occ).toContainText("%");
});
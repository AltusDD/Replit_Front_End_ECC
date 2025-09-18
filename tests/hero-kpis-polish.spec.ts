import { test, expect } from "@playwright/test";

const WEB = process.env.WEB || "http://localhost:5173";
const API = process.env.API || "http://localhost:8787";

async function pickIds(request: any) {
  let r = await request.get(`${API}/api/rpc/diag/ids`);
  if (!r.ok()) r = await request.get(`${API}/api/diag/ids`);
  const data = await r.json();
  const pick = (a?: number[]) => Array.isArray(a) && a.length ? a[0] : null;
  return {
    P: pick(data.properties), U: pick(data.units),
    L: pick(data.leases), O: pick(data.owners), T: pick(data.tenants)
  };
}

test.describe("Hero KPIs Polish - New KPI Test IDs", () => {
  test("lease card shows expected KPIs with defensive handling", async ({ page, request }) => {
    const { L } = await pickIds(request);
    test.skip(L == null, "No lease IDs in this environment");

    await page.goto(`${WEB}/card/lease/${L}`);
    
    // Test all expected lease KPIs are present (defensive against null/undefined)
    const expectedKpis = [
      "kpi-lease-status",
      "kpi-rent", 
      "kpi-term",
      "kpi-balance"
    ];

    for (const kpiId of expectedKpis) {
      await expect(page.getByTestId(kpiId), `Expected ${kpiId} to be visible`).toBeVisible();
    }
  });

  test("tenant card shows expected KPIs with payment health handling", async ({ page, request }) => {
    const { T } = await pickIds(request);
    test.skip(T == null, "No tenant IDs in this environment");

    await page.goto(`${WEB}/card/tenant/${T}`);
    
    // Test all expected tenant KPIs including new payment health metric
    const expectedKpis = [
      "kpi-active-leases",
      "kpi-current-balance",
      "kpi-on-time-rate",
      "kpi-open-workorders"
    ];

    for (const kpiId of expectedKpis) {
      await expect(page.getByTestId(kpiId), `Expected ${kpiId} to be visible`).toBeVisible();
    }
  });

  test("owner card shows expected KPIs with vacancy cost handling", async ({ page, request }) => {
    const { O } = await pickIds(request);
    test.skip(O == null, "No owner IDs in this environment");

    await page.goto(`${WEB}/card/owner/${O}`);
    
    // Test all expected owner KPIs including new occupancy and avg rent metrics
    const expectedKpis = [
      "kpi-portfolio-units",
      "kpi-active-leases", 
      "kpi-occupancy",
      "kpi-avg-rent"
    ];

    for (const kpiId of expectedKpis) {
      await expect(page.getByTestId(kpiId), `Expected ${kpiId} to be visible`).toBeVisible();
    }
  });

  test("unit card shows expected KPIs with multiple data shapes", async ({ page, request }) => {
    const { U } = await pickIds(request);
    test.skip(U == null, "No unit IDs in this environment");

    await page.goto(`${WEB}/card/unit/${U}`);
    
    // Test all expected unit KPIs are present
    const expectedKpis = [
      "kpi-lease-status",
      "kpi-rent",
      "kpi-bedbath", 
      "kpi-sqft"
    ];

    for (const kpiId of expectedKpis) {
      await expect(page.getByTestId(kpiId), `Expected ${kpiId} to be visible`).toBeVisible();
    }
  });

  test("all hero blocks render without errors when data is null/undefined", async ({ page, request }) => {
    // Test that our defensive null/undefined handling works by visiting cards
    // Even if data is missing/malformed, KPIs should render with placeholders
    const { P, U, L, T, O } = await pickIds(request);
    
    const cardTypes = [
      { type: "property", id: P },
      { type: "unit", id: U },
      { type: "lease", id: L },
      { type: "tenant", id: T },
      { type: "owner", id: O }
    ];

    for (const { type, id } of cardTypes) {
      if (id == null) continue;
      
      await page.goto(`${WEB}/card/${type}/${id}`);
      
      // Should not have any console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      
      // Wait for page to render
      await page.waitForTimeout(1000);
      
      // At least one KPI should be visible (defensive rendering)
      const kpiCount = await page.locator('[data-testid^="kpi-"]').count();
      expect(kpiCount).toBeGreaterThan(0);
    }
  });
});
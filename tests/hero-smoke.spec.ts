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

test.describe("Hero KPI Smoke Tests", () => {
  test("property hero KPI renders with valid values", async ({ page, request }) => {
    const { P } = await pickIds(request);
    test.skip(P == null, "No property IDs in this environment");

    await page.goto(`${WEB}/card/property/${P}`);
    
    // Check that namespaced hero KPIs are present and have non-empty values
    const heroKpis = [
      "hero.property.kpi.unitsTotal",
      "hero.property.kpi.activeLeases", 
      "hero.property.kpi.occupancy",
      "hero.property.kpi.avgRent"
    ];
    
    for (const testId of heroKpis) {
      const element = page.getByTestId(testId);
      await expect(element).toBeVisible();
      
      const text = await element.textContent();
      expect(text).toBeTruthy();
      expect(text).not.toBe("undefined");
      expect(text).not.toBe("");
    }
  });

  test("unit hero KPI renders with valid values", async ({ page, request }) => {
    const { U } = await pickIds(request);
    test.skip(U == null, "No unit IDs in this environment");

    await page.goto(`${WEB}/card/unit/${U}`);
    
    // Check that namespaced hero KPIs are present and have non-empty values
    const heroKpis = [
      "hero.unit.kpi.status",
      "hero.unit.kpi.rent",
      "hero.unit.kpi.bedBath",
      "hero.unit.kpi.sqft"
    ];
    
    for (const testId of heroKpis) {
      const element = page.getByTestId(testId);
      await expect(element).toBeVisible();
      
      const text = await element.textContent();
      expect(text).toBeTruthy();
      expect(text).not.toBe("undefined");
      expect(text).not.toBe("");
    }
  });
});
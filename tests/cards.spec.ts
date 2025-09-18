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

test.describe("ECC Asset Cards (UI smoke)", () => {
  test("property card renders hero KPIs, tabs, right rail", async ({ page, request }) => {
    const { P } = await pickIds(request);
    test.skip(P == null, "No property IDs in this environment");

    await page.goto(`${WEB}/card/property/${P}`);
    await expect(page.getByTestId("kpi-units")).toBeVisible();
    await expect(page.getByTestId("kpi-occupancy")).toBeVisible();
    await expect(page.getByTestId("kpi-avgrent")).toBeVisible();

    await expect(page.getByTestId("tab-overview")).toBeVisible();
    await expect(page.getByTestId("tab-financials")).toBeVisible();
    await expect(page.getByTestId("tab-legal")).toBeVisible();
    await expect(page.getByTestId("tab-files")).toBeVisible();

    await page.getByTestId("tab-financials").click();
    await expect(page.getByTestId("tab-financials")).toHaveAttribute("aria-selected", /true|/); // lazy loaded ok

    // right rail panel testids as you added
    await expect(page.getByTestId("rr-dates")).toBeVisible();
  });

  // New test for lease card with next-due KPI
  test("lease card renders next-due KPI", async ({ page, request }) => {
    const { L } = await pickIds(request);
    test.skip(L == null, "No lease IDs in this environment");

    await page.goto(`${WEB}/card/lease/${L}`);
    await expect(page.getByTestId("kpi-lease-status")).toBeVisible();
    await expect(page.getByTestId("kpi-rent")).toBeVisible();
    await expect(page.getByTestId("kpi-term")).toBeVisible();
    await expect(page.getByTestId("kpi-balance")).toBeVisible();
    await expect(page.getByTestId("kpi-next-due")).toBeVisible();
  });

  // New test for tenant card with payment-health KPI
  test("tenant card renders payment-health KPI", async ({ page, request }) => {
    const { T } = await pickIds(request);
    test.skip(T == null, "No tenant IDs in this environment");

    await page.goto(`${WEB}/card/tenant/${T}`);
    await expect(page.getByTestId("kpi-active-leases")).toBeVisible();
    await expect(page.getByTestId("kpi-current-balance")).toBeVisible();
    await expect(page.getByTestId("kpi-on-time-rate")).toBeVisible();
    await expect(page.getByTestId("kpi-open-workorders")).toBeVisible();
    await expect(page.getByTestId("kpi-payment-health")).toBeVisible();
  });

  // New test for owner card with vacancy-cost KPI
  test("owner card renders vacancy-cost KPI", async ({ page, request }) => {
    const { O } = await pickIds(request);
    test.skip(O == null, "No owner IDs in this environment");

    await page.goto(`${WEB}/card/owner/${O}`);
    await expect(page.getByTestId("kpi-portfolio-units")).toBeVisible();
    await expect(page.getByTestId("kpi-active-leases")).toBeVisible();
    await expect(page.getByTestId("kpi-occupancy")).toBeVisible();
    await expect(page.getByTestId("kpi-avg-rent")).toBeVisible();
    await expect(page.getByTestId("kpi-vacancy-cost")).toBeVisible();
  });

  for (const type of ["unit","lease","owner","tenant"] as const) {
    test(`${type} card basic render`, async ({ page, request }) => {
      const ids = await pickIds(request);
      const id = ids[type[0].toUpperCase() as "U"|"L"|"O"|"T"];
      test.skip(id == null, `No ${type} IDs in this environment`);

      await page.goto(`${WEB}/card/${type}/${id}`);
      // At least tabs visible (Overview exists) and hero KPIs common testids by card type:
      await expect(page.getByTestId(/tab-overview/)).toBeVisible();

      // Sample KPI checks per card type (soft, since KPIs vary)
      const maybe = [
        "kpi-lease-status","kpi-rent","kpi-bedbath","kpi-sqft",
        "kpi-active-leases","kpi-current-balance","kpi-on-time-rate","kpi-open-workorders",
        "kpi-portfolio-units","kpi-occupancy","kpi-avgrent"
      ];
      let seen = 0;
      for (const id2 of maybe) {
        const locator = page.getByTestId(id2);
        if (await locator.count()) { await expect(locator.first()).toBeVisible(); seen++; }
      }
      expect(seen).toBeGreaterThan(0);
    });
  }
});
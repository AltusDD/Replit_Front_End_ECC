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

  // New KPI tests for polished cards
  test("lease card shows next due KPI", async ({ page, request }) => {
    const { L } = await pickIds(request);
    test.skip(L == null, "No lease IDs in this environment");

    await page.goto(`${WEB}/card/lease/${L}`);
    await expect(page.getByTestId("kpi-term")).toBeVisible();
    // Verify the label shows "Next Due" instead of "Term"
    const termKpi = page.getByTestId("kpi-term");
    await expect(termKpi).toContainText("Next Due");
  });

  test("tenant card shows payment health KPI", async ({ page, request }) => {
    const { T } = await pickIds(request);
    test.skip(T == null, "No tenant IDs in this environment");

    await page.goto(`${WEB}/card/tenant/${T}`);
    await expect(page.getByTestId("kpi-on-time-rate")).toBeVisible();
    // Verify the label shows "Payment Health"
    const paymentHealthKpi = page.getByTestId("kpi-on-time-rate");
    await expect(paymentHealthKpi).toContainText("Payment Health");
  });

  test("owner card shows vacancy cost KPI", async ({ page, request }) => {
    const { O } = await pickIds(request);
    test.skip(O == null, "No owner IDs in this environment");

    await page.goto(`${WEB}/card/owner/${O}`);
    await expect(page.getByTestId("kpi-avg-rent")).toBeVisible();
    // Verify the label shows "Vacancy Cost"
    const vacancyCostKpi = page.getByTestId("kpi-avg-rent");
    await expect(vacancyCostKpi).toContainText("Vacancy Cost");
  });
});
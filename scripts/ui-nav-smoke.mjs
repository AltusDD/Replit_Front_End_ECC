import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1) Properties table loads
  await page.goto("http://localhost:5173/portfolio/properties", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="datatable"]'); // your table testid

  // 2) Double-click first row
  const firstRow = (await page.$$('[data-testid="datatable-row"]'))[0];
  if (!firstRow) throw new Error("No rows rendered");
  await firstRow.dblclick();

  // 3) Assert we navigated to /card/property/<id>
  await page.waitForURL(/\/card\/property\/\d+/, { timeout: 5000 });
  console.log("NAV_OK", page.url());

  await browser.close();
})();
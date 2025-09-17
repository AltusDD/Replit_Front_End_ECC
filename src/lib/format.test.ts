import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from "@/lib/format";

test("formatNumber edge cases", () => {
  expect(formatNumber(0)).toBe("0.00");
  expect(formatNumber("1234", 0)).toMatch(/1,234/);
  expect(formatNumber(null as any)).toBe(BLANK);
  expect(formatNumber(NaN)).toBe(BLANK);
});

test("formatPercent basis", () => {
  expect(formatPercent(0.125)).toBe("12.5%");
  expect(formatPercent(12.5, 1, "percent")).toBe("12.5%");
  expect(formatPercent(undefined as any)).toBe(BLANK);
});

test("formatCurrencyFromCents", () => {
  expect(formatCurrencyFromCents(123456)).toMatch(/\$1,234\.56/);
  expect(formatCurrencyFromCents(-5050)).toMatch(/-\$50\.50/);
  expect(formatCurrencyFromCents("oops" as any)).toBe(BLANK);
});
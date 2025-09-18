import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";

it("renders kpi-next-due", () => {
  render(<HeroBlock data={{ lease: { status: "Active", rent_cents: 120000, term: "MTM", balance_cents: 0, next_due: "2025-10-01" } }} />);
  expect(screen.getByTestId("kpi-next-due")).toBeInTheDocument();
});
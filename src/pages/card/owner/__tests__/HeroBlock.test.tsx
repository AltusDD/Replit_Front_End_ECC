import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";

it("renders kpi-vacancy-cost", () => {
  render(<HeroBlock data={{ owner: { occupancy_pct: 0.9, avg_rent_cents: 150000, portfolio_units: 10 } }} />);
  expect(screen.getByTestId("kpi-vacancy-cost")).toBeInTheDocument();
});
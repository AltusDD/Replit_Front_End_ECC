import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";

it("renders kpi-payment-health", () => {
  render(<HeroBlock data={{ tenant: { on_time_rate: 0.9 } }} />);
  expect(screen.getByTestId("kpi-payment-health")).toBeInTheDocument();
});
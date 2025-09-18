import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";

describe("Lease HeroBlock", () => {
  it("renders required KPI testids", () => {
    const data = {
      lease: { status: "Active", rent_cents: 125000, term: "12 mo", balance_cents: 5000, expiration: "2026-01-31" }
    };
    render(<HeroBlock data={data} />);
    ["kpi-lease-status","kpi-rent","kpi-term","kpi-balance"].forEach(id =>
      expect(screen.getByTestId(id)).toBeInTheDocument()
    );
  });
});
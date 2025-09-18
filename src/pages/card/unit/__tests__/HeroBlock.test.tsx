import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";

describe("Unit HeroBlock", () => {
  it("renders required KPI testids", () => {
    const data = { unit: { lease_status: "Vacant", market_rent_cents: 150000, beds: 2, baths: 1, sq_ft: 850 } };
    render(<HeroBlock data={data} />);
    ["kpi-lease-status","kpi-rent","kpi-bedbath","kpi-sqft"].forEach(id =>
      expect(screen.getByTestId(id)).toBeInTheDocument()
    );
  });
});
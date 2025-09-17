import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";
import { TESTIDS } from "@/testing/testIds";

describe("Unit HeroBlock", () => {
  it("renders KPIs with provided values", () => {
    const mockData = {
      lease: {
        status: "active",
        rent_cents: 175000
      },
      unit: {
        beds: 2,
        baths: 2,
        sqft: 1200
      }
    };

    render(<HeroBlock data={mockData} />);

    // Check that the component renders without crashing
    expect(screen.getByTestId("unit-kpis")).toBeInTheDocument();
    
    // Check for individual KPI testids
    expect(screen.getByTestId(TESTIDS.UNIT.KPI_LEASE_STATUS)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.UNIT.KPI_RENT)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.UNIT.KPI_BEDBATH)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.UNIT.KPI_SQFT)).toBeInTheDocument();
    
    // Check for key labels
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Bed/Bath")).toBeInTheDocument();
    expect(screen.getByText("Sq Ft")).toBeInTheDocument();
    
    // Check for data values
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("$1,750")).toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });

  it("renders fallback values when data is missing", () => {
    const mockData = {};

    render(<HeroBlock data={mockData} />);

    expect(screen.getByTestId("unit-kpis")).toBeInTheDocument();
    
    // Should show fallback values
    const dashElements = screen.getAllByText("—");
    expect(dashElements).toHaveLength(4); // All KPIs should show "—"
  });

  it("uses unit status when lease status is not available", () => {
    const mockData = {
      unit: {
        status: "vacant",
        beds: 1,
        baths: 1,
        sqft: 800
      }
    };

    render(<HeroBlock data={mockData} />);

    expect(screen.getByText("vacant")).toBeInTheDocument();
    expect(screen.getByText("1/1")).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();
  });
});
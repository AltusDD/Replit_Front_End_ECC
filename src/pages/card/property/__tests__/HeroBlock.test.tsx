import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";
import { TESTIDS } from "@/testing/testIds";

describe("Property HeroBlock", () => {
  it("renders KPIs with provided values", () => {
    const mockData = {
      kpis: {
        units: 25,
        activeLeases: 20,
        occupancyPct: 80,
        avgRentCents: 180000
      }
    };

    render(<HeroBlock data={mockData} />);

    // Check that the component renders without crashing
    expect(screen.getByTestId("property-kpis")).toBeInTheDocument();
    
    // Check for testids
    expect(screen.getByTestId(TESTIDS.PROPERTY.KPI_UNITS)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.PROPERTY.KPI_ACTIVE)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.PROPERTY.KPI_OCCUPANCY)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.PROPERTY.KPI_AVGRENT)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.PROPERTY.ADDRESS)).toBeInTheDocument();
    
    // Check for key labels
    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    expect(screen.getByText("Occupancy")).toBeInTheDocument();
    expect(screen.getByText("Avg Rent")).toBeInTheDocument();
    
    // Check for data values
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("$1,800")).toBeInTheDocument();
  });

  it("renders fallback values when data is missing", () => {
    const mockData = {};

    render(<HeroBlock data={mockData} />);

    expect(screen.getByTestId("property-kpis")).toBeInTheDocument();
    
    // Should show fallback values
    const dashElements = screen.getAllByText("—");
    expect(dashElements).toHaveLength(4); // All KPIs should show "—"
  });
});
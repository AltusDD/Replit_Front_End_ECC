import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";
import { TESTIDS } from "@/testing/testIds";

describe("Owner HeroBlock", () => {
  it("renders KPIs with provided values", () => {
    const mockData = {
      kpis: {
        units: 100,
        activeLeases: 85,
        occupancyPct: 85,
        avgRentCents: 200000
      }
    };

    render(<HeroBlock data={mockData} />);

    // Check that the component renders without crashing
    expect(screen.getByTestId("owner-kpis")).toBeInTheDocument();
    
    // Check for individual KPI testids
    expect(screen.getByTestId(TESTIDS.OWNER.KPI_PORTFOLIO_UNITS)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.OWNER.KPI_ACTIVE_LEASES)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.OWNER.KPI_OCCUPANCY)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.OWNER.KPI_AVG_RENT)).toBeInTheDocument();
    
    // Check for key labels
    expect(screen.getByText("Portfolio Units")).toBeInTheDocument();
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    expect(screen.getByText("Occupancy")).toBeInTheDocument();
    expect(screen.getByText("Avg Rent")).toBeInTheDocument();
    
    // Check for data values
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("$2,000")).toBeInTheDocument();
  });

  it("renders fallback values when data is missing", () => {
    const mockData = {};

    render(<HeroBlock data={mockData} />);

    expect(screen.getByTestId("owner-kpis")).toBeInTheDocument();
    
    // Should show fallback values
    const dashElements = screen.getAllByText("—");
    expect(dashElements).toHaveLength(4); // All KPIs should show "—"
  });

  it("handles large numbers with proper formatting", () => {
    const mockData = {
      kpis: {
        units: 1250,
        activeLeases: 1100,
        occupancyPct: 88,
        avgRentCents: 275000
      }
    };

    render(<HeroBlock data={mockData} />);

    // Check for properly formatted large numbers
    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("1,100")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();
    expect(screen.getByText("$2,750")).toBeInTheDocument();
  });
});
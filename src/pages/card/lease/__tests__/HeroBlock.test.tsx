import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";
import { TESTIDS } from "@/testing/testIds";

describe("Lease HeroBlock", () => {
  it("renders KPIs with provided values", () => {
    const mockData = {
      lease: {
        status: "active",
        rent_cents: 150000,
        start_date: "2024-01-01",
        end_date: "2024-12-31"
      }
    };

    render(<HeroBlock data={mockData} />);

    // Check that the component renders without crashing
    expect(screen.getByTestId("lease-kpis")).toBeInTheDocument();
    
    // Check for individual KPI testids
    expect(screen.getByTestId(TESTIDS.LEASE.KPI_LEASE_STATUS)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.LEASE.KPI_RENT)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.LEASE.KPI_TERM)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.LEASE.KPI_BALANCE)).toBeInTheDocument();
    
    // Check for key labels
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Monthly Rent")).toBeInTheDocument();
    expect(screen.getByText("Term")).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    
    // Check for data values
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("$1,500")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01 → 2024-12-31")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("renders fallback values when data is missing", () => {
    const mockData = {};

    render(<HeroBlock data={mockData} />);

    expect(screen.getByTestId("lease-kpis")).toBeInTheDocument();
    
    // Should show fallback values
    const dashElements = screen.getAllByText("—");
    expect(dashElements).toHaveLength(3); // Status, Monthly Rent, Term should show "—"
    expect(screen.getByText("$0")).toBeInTheDocument(); // Balance should show "$0"
  });
});
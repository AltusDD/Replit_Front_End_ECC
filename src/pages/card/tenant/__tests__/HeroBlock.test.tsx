import { render, screen } from "@testing-library/react";
import HeroBlock from "../HeroBlock";
import { TESTIDS } from "@/testing/testIds";

describe("Tenant HeroBlock", () => {
  it("renders KPIs with provided values", () => {
    const mockData = {
      leases: [
        { status: "active" },
        { status: "active" },
        { status: "expired" },
        { status: "Active" } // Test case insensitive
      ]
    };

    render(<HeroBlock data={mockData} />);

    // Check that the component renders without crashing
    expect(screen.getByTestId("tenant-kpis")).toBeInTheDocument();
    
    // Check for individual KPI testids
    expect(screen.getByTestId(TESTIDS.TENANT.KPI_ACTIVE_LEASES)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.TENANT.KPI_CURRENT_BALANCE)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.TENANT.KPI_ON_TIME_RATE)).toBeInTheDocument();
    expect(screen.getByTestId(TESTIDS.TENANT.KPI_OPEN_WORKORDERS)).toBeInTheDocument();
    
    // Check for key labels
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    expect(screen.getByText("Current Balance")).toBeInTheDocument();
    expect(screen.getByText("On-Time Rate")).toBeInTheDocument();
    expect(screen.getByText("Open Work Orders")).toBeInTheDocument();
    
    // Check for data values
    expect(screen.getByText("3")).toBeInTheDocument(); // 3 active leases (case insensitive)
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders fallback values when data is missing", () => {
    const mockData = {};

    render(<HeroBlock data={mockData} />);

    expect(screen.getByTestId("tenant-kpis")).toBeInTheDocument();
    
    // Check for specific labels to avoid ambiguity with multiple "0" values
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    
    // Verify the KPIs container has the expected structure
    const container = screen.getByTestId("tenant-kpis");
    expect(container.children).toHaveLength(4);
  });

  it("calculates active leases correctly with empty array", () => {
    const mockData = {
      leases: []
    };

    render(<HeroBlock data={mockData} />);

    // Check specifically for the Active Leases value by looking for its parent element
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    const activeLeaseLabel = screen.getByText("Active Leases");
    const activeLeaseContainer = activeLeaseLabel.closest('.kpi');
    expect(activeLeaseContainer).toBeInTheDocument();
    expect(activeLeaseContainer).toHaveTextContent("Active Leases0");
  });
});
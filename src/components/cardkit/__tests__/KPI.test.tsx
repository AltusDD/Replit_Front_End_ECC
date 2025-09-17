import { render, screen } from "@testing-library/react";
import KPI from "../KPI";
import { BLANK } from "@/lib/format";

describe("<KPI />", () => {
  it("forwards data-testid to the root", () => {
    render(<KPI data-testid="kpi-probe" label="Probe" value={1} />);
    expect(screen.getByTestId("kpi-probe")).toBeInTheDocument();
  });

  it("renders BLANK for non-finite / missing values", () => {
    const { rerender } = render(<KPI label="X" value={undefined as any} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
    rerender(<KPI label="X" value={NaN} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
    rerender(<KPI label="X" value={Infinity} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
    rerender(<KPI label="X" value={null as any} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
  });

  it("renders plain number via formatNumber (0 stays '0')", () => {
    render(<KPI label="Num" value={0} />);
    // We don't assert exact DOM structure—just the content is present.
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders percent when percent flag is set", () => {
    // e.g. 0.555 -> "55.5%" or similar per your formatter
    render(<KPI label="Occ" value={0.555} percent />);
    // Use fuzzy match to avoid coupling to decimal places
    expect(screen.getByText(/55/)).toBeInTheDocument();
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it("renders currency when currency flag is set", () => {
    render(<KPI label="Rev" value={1250} currency />);
    // We don't fix the locale symbol; just assert dollars sign or digits present.
    expect(screen.getByText(/\$?\s*1,?250/)).toBeInTheDocument();
  });
});
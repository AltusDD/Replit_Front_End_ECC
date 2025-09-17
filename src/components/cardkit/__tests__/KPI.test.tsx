import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { KPI } from "../KPI";
import { BLANK } from "../../../lib/format";

describe("<KPI />", () => {
  it("forwards data-testid to the root", () => {
    render(<KPI label="Probe" value={1} data-testid="kpi-probe" />);
    expect(screen.getByTestId("kpi-probe")).toBeInTheDocument();
  });

  it("renders BLANK for non-finite / missing values", () => {
    const { rerender } = render(<KPI label="X" value={undefined as any} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
    rerender(<KPI label="X" value={NaN} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
    rerender(<KPI label="X" value={Infinity} />);
    expect(screen.getByText(BLANK)).toBeInTheDocument();
  });

  it("renders percent when percent flag is set", () => {
    render(<KPI label="Occ" value={0.555} percent data-testid="kpi-occ" />);
    expect(screen.getByTestId("kpi-occ")).toHaveTextContent("%");
  });

  it("renders currency when currency flag is set", () => {
    render(<KPI label="Rev" value={1250} currency />);
    expect(screen.getByText(/1,?250/)).toBeInTheDocument();
  });
});
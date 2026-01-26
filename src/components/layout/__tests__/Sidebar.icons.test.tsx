import { render, screen } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { NavBadgeProvider } from "../NavBadgeProvider";

it("renders exact lucide icons (data-icon attribute)", () => {
  render(
    <NavBadgeProvider>
      <Sidebar />
    </NavBadgeProvider>
  );
  // Check at least one known top-level icon exists (adjust to a guaranteed section in your SSOT)
  const anyIcon = screen.getAllByRole("img", { hidden: true })[0] as HTMLElement | undefined;
  expect(anyIcon?.getAttribute("data-icon")).toBeTruthy();
});
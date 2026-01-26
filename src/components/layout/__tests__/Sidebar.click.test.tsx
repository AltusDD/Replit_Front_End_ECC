import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "wouter";
import Sidebar from "../../../Sidebar";
import { NavBadgeProvider } from "../NavBadgeProvider";

function renderWithRouter(ui: React.ReactNode, initialPath = "/") {
  // MemoryRouter alternative pattern
  window.history.pushState({}, "", initialPath);
  return render(<Router base="">{ui}</Router>);
}

it("nav rows are clickable links", () => {
  renderWithRouter(
    <NavBadgeProvider>
      <Sidebar />
    </NavBadgeProvider>
  );

  // pick the first rendered link
  const first = screen.getAllByTestId(/nav-link-/)[0];
  const anchor = first.querySelector("a")!;
  expect(anchor).toBeInTheDocument();

  const href = anchor.getAttribute("href");
  expect(href).toBeTruthy();

  fireEvent.click(anchor);
  expect(window.location.pathname).toBe(href);
});
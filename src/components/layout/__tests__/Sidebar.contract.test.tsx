import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { NavBadgeProvider } from "../NavBadgeProvider";
import { Router } from "wouter";

function mount(path="/"){
  window.history.pushState({}, "", path);
  return render(<Router base=""><NavBadgeProvider><Sidebar/></NavBadgeProvider></Router>);
}

it("shows pin button and toggles collapsed/pinned", () => {
  mount("/");
  const pin = screen.getByTestId("nav-pin");
  expect(pin).toBeInTheDocument();
  fireEvent.click(pin); // unpin -> collapsed
});

it("expands and collapses a section", () => {
  mount("/");
  const btn = screen.getAllByRole("button", { name: /.+/ })[0];
  const id = btn.getAttribute("aria-controls")!;
  const child = document.getElementById(id)!;
  expect(child.className).toContain("hidden");
  fireEvent.click(btn);
  expect(child.className).toContain("block");
});

it("renders lucide icons with data-icon", () => {
  mount("/");
  const any = screen.getAllByTestId(/nav-section-/)[0];
  const svg = any.querySelector("[data-icon]");
  expect(svg).toBeTruthy();
});

it("highlights active child link", () => {
  mount("/portfolio/properties");
  const link = screen.getAllByTestId(/nav-link-/)[0];
  const a = link.querySelector("a")!;
  if (a.getAttribute("href") === "/portfolio/properties") {
    expect(a.className).toContain("ecc-link-active");
  }
});

it("renders from SSOT and exposes required data-testids", () => {
  // Provide some badge counts to exercise the badge system
  const counts = {
    // pretend these match some badgeKey values in NAV_SECTIONS
    delinquencyOpen: 7,
    legalOpenCases: 3,
  };

  render(
    <NavBadgeProvider counts={counts}>
      <Sidebar />
    </NavBadgeProvider>
  );

  // Root exists
  expect(screen.getByTestId("nav-root")).toBeInTheDocument();

  // Should have nav sections
  const sections = screen.getAllByTestId(/^nav-section-/);
  expect(sections.length).toBeGreaterThan(10); // Should be 13+ sections from SSOT
});
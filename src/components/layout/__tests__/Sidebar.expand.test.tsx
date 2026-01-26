import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { NavBadgeProvider } from "../NavBadgeProvider";

it("expands and collapses section children", () => {
  render(
    <NavBadgeProvider>
      <Sidebar />
    </NavBadgeProvider>
  );

  // Find a section button (first one)
  const section = screen.getAllByRole("button", { name: /.+/i })[0];
  const sectionId = section.getAttribute("aria-controls")!;
  const children = document.getElementById(sectionId)!;

  // Initially hidden
  expect(children.className).toMatch(/hidden/);

  // Toggle open
  fireEvent.click(section);
  expect(children.className).toMatch(/block/);

  // Toggle closed
  fireEvent.click(section);
  expect(children.className).toMatch(/hidden/);
});
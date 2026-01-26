import { render, screen, fireEvent } from "@testing-library/react";
import SafeLink from "../SafeLink";

it("falls back to pushState when router not present", () => {
  const push = jest.spyOn(window.history, "pushState");
  render(<SafeLink href="/foo">Go</SafeLink>);
  fireEvent.click(screen.getByText("Go"));
  expect(push).toHaveBeenCalled();
});
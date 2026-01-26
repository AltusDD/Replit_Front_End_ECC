import { render, screen } from "@testing-library/react";
import PropertiesPage from "../PropertiesPage";

it("renders shell and table placeholders", () => {
  render(<PropertiesPage />);
  expect(screen.getByTestId("properties-page")).toBeInTheDocument();
  // will show loading first; we only assert the shell here
});
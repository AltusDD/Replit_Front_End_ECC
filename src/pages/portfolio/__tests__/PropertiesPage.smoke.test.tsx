import { render, screen } from "@testing-library/react";
import PropertiesPage from "../PropertiesPage";

it("renders properties page shell", () => {
  render(<PropertiesPage />);
  expect(screen.getByTestId("properties-page")).toBeInTheDocument();
});
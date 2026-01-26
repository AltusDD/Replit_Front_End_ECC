import { render, screen } from "@testing-library/react";
import AssetsPage from "../AssetsPage";

it("renders the Assets page root", () => {
  render(<AssetsPage />);
  expect(screen.getByTestId("assets-page")).toBeInTheDocument();
});
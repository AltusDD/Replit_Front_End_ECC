import { render, screen } from "@testing-library/react";
import AddPropertyWizard from "../components/AddPropertyWizard";

it("renders wizard shell", () => {
  render(<AddPropertyWizard onClose={()=>{}} onCreated={()=>{}} />);
  expect(screen.getByTestId("wizard-add-property")).toBeInTheDocument();
});
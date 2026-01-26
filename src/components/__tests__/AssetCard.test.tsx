import { render, screen } from "@testing-library/react";
import AssetCard from "../AssetCard";

it("renders AssetCard contract test-ids", () => {
  render(
    <AssetCard
      name="Test"
      address="1 Main"
      city="Gary"
      state="IN"
      status="Active"
      unitCount={3}
      avgRentCents={123400}
      onOpen={() => {}}
    />
  );
  ["assetcard-name","assetcard-location","assetcard-status","assetcard-unitcount","assetcard-avgrent","assetcard-open"]
    .forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument());
});
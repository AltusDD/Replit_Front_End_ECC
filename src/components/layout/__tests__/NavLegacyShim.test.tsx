import { render } from "@testing-library/react";
// legacy names should still import without throwing:
import { navSections as legacyNav, NAV as legacyNAV } from "@/config/navigation/legacy";
import { NAV_SECTIONS } from "@/config/navigation";

it("legacy nav shims re-export SSOT", () => {
  expect(Array.isArray(NAV_SECTIONS)).toBe(true);
  expect(legacyNav).toBe(NAV_SECTIONS);
  expect(legacyNAV).toBe(NAV_SECTIONS);
  // No render target here; just verifying value/identity.
  render(<div />);
});
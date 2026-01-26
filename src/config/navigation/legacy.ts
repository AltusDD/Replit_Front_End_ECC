// Legacy shim to keep old imports alive while enforcing SSOT.
// Anything that imported these names now receives the SSOT.
import { NAV_SECTIONS } from "./index";

// Old "canonical" names some files used:
export const navSections = NAV_SECTIONS;
export const NAV = NAV_SECTIONS;

// Optional legacy types (best-effort) — map to "any" to avoid churn.
// Replace with real mapped types if you want strict typing.
export type NavSection = any;
export type NavLink = any;
export type NavParent = any;
export type NavChild = any;
// DEPRECATED: navConfig.ts
// Do not import from this file going forward. Use "@/config/navigation".
export { NAV_SECTIONS as navSections } from "@/config/navigation"; // keeps old name alive
export { NAV_SECTIONS as NAV } from "@/config/navigation";        // keeps old name alive

// Re-export legacy types as "any" to avoid breaking builds.
// (You can tighten these later if you want.)
export type NavSection = any;
export type NavLink = any;

// Default export compatibility
import { NAV_SECTIONS } from "@/config/navigation";
const navConfig = { sections: NAV_SECTIONS, items: NAV_SECTIONS };
export default navConfig;
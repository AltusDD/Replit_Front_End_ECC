import React, { createContext, useContext } from "react";
import type { NavBadgeCounts } from "./navTypes";

// Sample badge data for demonstration
const sampleBadgeCounts: NavBadgeCounts = {
  "ops-accounting-rent-collection": 5,
  "ops-accounting-collections-dashboard": 12,
  "ops-maintenance-work-orders": 8,
  "ops-legal-case-manager": 3,
  "ops-comms-queue": 15,
  "portfolio-properties": 2,
  "reports": 7,
  "investor-dashboard": 4,
  "ops-accounting-collections-log": 104, // Testing 99+ display
};

const NavBadgeContext = createContext<NavBadgeCounts>(sampleBadgeCounts);

export const NavBadgeProvider: React.FC<{
  counts?: NavBadgeCounts;
  children: React.ReactNode;
}> = ({ counts = sampleBadgeCounts, children }) => (
  <NavBadgeContext.Provider value={counts}>{children}</NavBadgeContext.Provider>
);

export function useNavBadges() {
  return useContext(NavBadgeContext);
}
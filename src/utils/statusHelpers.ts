// Centralized status helpers to prevent substring matching bugs
// Provides consistent status mapping across the application

export type StatusType = "active" | "inactive" | "vacant" | "occupied" | "pending" | "available" | "unknown";

export type BadgeStatus = "Active" | "Vacant" | "info" | "warning" | "danger";

/**
 * Normalizes a status string to a standard status type
 * Uses exact matching to prevent bugs like "inactive" matching "active"
 */
export function normalizeStatus(status: string | null | undefined): StatusType {
  if (!status) return "unknown";
  
  const normalized = status.toLowerCase().trim();
  
  // Use exact matching to prevent substring issues
  switch (normalized) {
    case "active":
    case "true":
      return "active";
    case "inactive": 
    case "false":
      return "inactive";
    case "vacant":
      return "vacant";
    case "occupied":
      return "occupied";
    case "pending":
    case "prospect_tenant":
      return "pending";
    case "available":
      return "available";
    default:
      return "unknown";
  }
}

/**
 * Determines if a status represents an active/positive state
 * Used for filtering active properties and owners
 */
export function isActiveStatus(status: string | null | undefined): boolean {
  const normalized = normalizeStatus(status);
  return normalized === "active" || normalized === "occupied";
}

/**
 * Determines if a status represents an inactive/negative state
 */
export function isInactiveStatus(status: string | null | undefined): boolean {
  const normalized = normalizeStatus(status);
  return normalized === "inactive" || normalized === "vacant";
}

/**
 * Maps a status to the appropriate badge status for visual display
 */
export function getStatusBadge(status: string | null | undefined): { label: string; status: BadgeStatus } {
  const normalized = normalizeStatus(status);
  const originalStatus = status || "Unknown";
  
  switch (normalized) {
    case "active":
    case "occupied":
      return { label: originalStatus, status: "Active" };
    case "inactive":
    case "vacant":
      return { label: originalStatus, status: "Vacant" };
    case "pending":
      return { label: originalStatus, status: "warning" };
    default:
      return { label: originalStatus, status: "info" };
  }
}

/**
 * Gets owner-specific status badge considering both general status and owner_status
 */
export function getOwnerStatusBadge(
  status: string | null | undefined,
  ownerStatus: string | null | undefined
): { label: string; status: BadgeStatus } {
  // Prefer owner_status if available, fallback to general status
  const primaryStatus = ownerStatus || status;
  return getStatusBadge(primaryStatus);
}

/**
 * Filters properties to only include active ones
 * Prevents the substring bug where "inactive" was counted as active
 */
export function filterActiveProperties(properties: any[]): any[] {
  return properties.filter(property => {
    // Check multiple status fields that might indicate activity
    const mainStatus = property.status;
    const occupancyStatus = property.occupancy_status;
    
    // Use exact matching instead of substring matching
    return isActiveStatus(mainStatus) || 
           isActiveStatus(occupancyStatus) || 
           !mainStatus; // Treat missing status as active (legacy data)
  });
}

/**
 * Calculates portfolio metrics with accurate status counting
 */
export function calculatePortfolioMetrics(properties: any[]) {
  const total = properties.length;
  const active = filterActiveProperties(properties).length;
  const inactive = properties.filter(prop => 
    isInactiveStatus(prop.status) || isInactiveStatus(prop.occupancy_status)
  ).length;
  
  return {
    total,
    active,
    inactive,
    activeRate: total > 0 ? Math.round((active / total) * 100) : 0
  };
}
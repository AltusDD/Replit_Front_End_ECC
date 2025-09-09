export function ownerDisplay(company?: string|null, first?: string|null, last?: string|null) {
  if (company && company.trim()) return company.trim();
  const parts = [last, first].filter(Boolean);
  return parts.length ? parts.join(", ") : "Unknown Owner";
}
